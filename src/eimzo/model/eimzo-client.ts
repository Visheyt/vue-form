import type { CAPIResponse, Certificate } from './types'

// --- Eimzo Base64 ---
export const EimzoBase64 = {
  encode: (s: string): string =>
    btoa(unescape(encodeURIComponent(s))),
}

export type DomainAPIKeys = string[]

// --- CAPI WebSocket Bridge ---
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

// --- EIMZO Client ---
export class EIMZOClient {
  private API_KEYS: DomainAPIKeys = [
    'localhost',
    '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
    '127.0.0.1',
    'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
  ]

  /** Инициализация E-IMZO */
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
      arguments: this.API_KEYS,
    })
    if (!apiData.success)
      throw new Error('Ошибка API_KEY: ' + apiData.reason)

    return version
  }

  /** Получить список всех сертификатов */
  async listAllUserKeys(): Promise<Certificate[]> {
    const { data } = await CAPIWS.callFunction({
      plugin: 'pfx',
      name: 'list_all_certificates',
    })
    if (!data.success) throw new Error(data.reason)

    return data.certificates.map((cert: Certificate) => ({
      ...cert,
      ...this._parseAlias(cert.alias),
      type: 'pfx',
      id: cert.serialNumber,
    }))
  }

  /** Загрузить ключ (E-IMZO prompt для пароля) */
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

  /** Создать PKCS#7 подпись (CAdES-BES) */
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

  /** Парсинг Alias сертификата */
  private _parseAlias(alias: string) {
    const clean = alias
      .toUpperCase()
      .replace('1.2.860.3.16.1.1=', 'INN=')
      .replace('1.2.860.3.16.1.2=', 'PINFL=')

    const extract = (field: string) => {
      const parts = clean.split(',')
      for (let s of parts) {
        if (s.includes(`${field}=`))
          return s.split('=')[1].trim()
      }
      return ''
    }

    return {
      inn: extract('INN') || extract('UID'),
      pinfl: extract('PINFL'),
      cn: extract('CN'),
      org: extract('O'),
      serial: extract('SERIALNUMBER'),
    }
  }
}
