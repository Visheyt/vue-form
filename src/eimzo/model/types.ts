export type Certificate = {
  alias: string
  serialNumber: string
  type: 'pfx'
  id: string
  inn?: string
  pinfl?: string
  cn?: string
  org?: string
  serial?: string
  disk: string
  path: string
  name: string
  validTo: string
  validFrom: string
  isCompany: boolean
}

export type CAPIResponse = {
  success: boolean
  reason?: string
  [key: string]: any
}
