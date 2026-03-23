import { EimzoBase64 } from '../lib/eimzo-base64'
import type {
  CAPIResponse,
  Certificate,
  EimzoUserType,
} from './types'

// Wsocket API для взаимодействия с E-IMZO CAPI
const CAPIWS = {
  URL:
    (window.location.protocol === 'https:'
      ? 'wss://127.0.0.1:64443'
      : 'ws://127.0.0.1:64646') + '/service/cryptapi',

  callFunction: function (funcDef: object): Promise<{
    event: MessageEvent
    data: CAPIResponse
  }> {
    return new Promise((resolve, reject) => {
      if (!window.WebSocket)
        return reject("Browser doesn't support WebSocket")

      let socket: WebSocket
      try {
        socket = new WebSocket(this.URL)
      } catch (e) {
        return reject(e)
      }

      socket.onopen = () =>
        socket.send(JSON.stringify(funcDef))
      socket.onmessage = (event) => {
        const data: CAPIResponse = JSON.parse(event.data)
        socket.close()
        resolve({ event, data })
      }
      socket.onerror = (e) => reject(e)
      socket.onclose = (e) => {
        if (e.code !== 1000)
          reject(`Socket closed with code ${e.code}`)
      }
    })
  },
}

// EimzoClient для работы с E-IMZO CAPI
export class EIMZOClient {
  constructor(
    private apiKeys: string[] = [
      'localhost',
      '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
      '127.0.0.1',
      'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
    ],
  ) {}

  async init() {
    const { data } = await CAPIWS.callFunction({
      name: 'version',
    })
    if (!data.success)
      throw new Error(
        data.reason || 'Unknown version error',
      )

    const version =
      parseInt(data.major) * 100 + parseInt(data.minor)

    const { data: apiData } = await CAPIWS.callFunction({
      name: 'apikey',
      arguments: this.apiKeys,
    })
    if (!apiData.success)
      throw new Error('Ошибка API_KEY: ' + apiData.reason)

    return version
  }

  /** E-IMZO CAPI функция для получения списка всех сертификатов пользователя */
  async listAllUserKeys(): Promise<Certificate[]> {
    const { data } = await CAPIWS.callFunction({
      plugin: 'pfx',
      name: 'list_all_certificates',
    })
    if (!data.success) throw new Error(data.reason)

    const now = new Date()

    return data.certificates
      .map((cert: Certificate) => ({
        ...cert,
        ...this.parseAlias(cert.alias),
        type: 'pfx',
        id: cert.serialNumber,
      }))
      .filter((cert: any) => {
        const expiry = new Date(
          cert.validTo.replace(/\./g, '-'),
        )
        return expiry > now
      })
  }

  /** Eimzo CAPI функция для загрузки ключа в память по данным сертификата */
  async loadKey(key: Certificate): Promise<string> {
    const args = [key.disk, key.path, key.name, key.alias]
    const { data } = await CAPIWS.callFunction({
      plugin: 'pfx',
      name: 'load_key',
      arguments: args,
    })
    if (!data.success) throw new Error(data.reason)
    return data.keyId
  }

  /** Подписание данных с помощью ключа, загруженного в память (по keyId) */
  async createPkcs7(
    keyId: string,
    content: string,
    isBase64 = false,
  ): Promise<string> {
    const data64 = isBase64
      ? content
      : EimzoBase64.encode(content)
    const { data } = await CAPIWS.callFunction({
      plugin: 'pkcs7',
      name: 'create_pkcs7',
      arguments: [data64, keyId, 'no'],
    })
    if (!data.success) throw new Error(data.reason)
    return data.pkcs7_64
  }

  // Вспомогательная функция для извлечения данных из alias сертификата
  private parseAlias(alias: string) {
    const extract = (key: string): string => {
      const regex = new RegExp(
        `(?:,|^)${key.toLowerCase()}=([^,]+)`,
        'i',
      )
      const match = alias.match(regex)
      return match ? match[1].trim() : ''
    }
    const innOrg = extract('1.2.860.3.16.1.1')
    const pinfl = extract('1.2.860.3.16.1.2')
    const uid = extract('uid')
    const orgName = extract('o')
    const cn = extract('cn')

    let userType: EimzoUserType = 'PHYSICAL'

    if (orgName) {
      const orgUpper = orgName.toUpperCase()
      const cnUpper = cn.toUpperCase()

      const isEntrepreneur =
        orgUpper.includes('YATT') ||
        orgUpper.includes('YAKKA TARTIBDAGI') ||
        orgUpper.includes('ЯТТ') ||
        orgUpper.includes('ЯККА ТАРТИБДАГИ') ||
        cnUpper.includes('YATT') ||
        cnUpper.includes('ЯТТ')

      userType = isEntrepreneur ? 'ENTREPRENEUR' : 'LEGAL'
    }

    return {
      inn: innOrg || uid,
      pinfl: pinfl,
      cn: cn,
      org: orgName,
      userType: userType,
      serial: extract('serialnumber'),
      validFrom: extract('validfrom'),
      validTo: extract('validto'),
    }
  }
}
