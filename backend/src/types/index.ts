export type Environment = 'development' | 'production' | 'test'

export interface Chain {
  id: number
  name: string
}

export interface CreateChainInput {
  name: string
}

export interface UpdateChainInput {
  name?: string
}

export interface ErgBrand {
  id: number
  name: string
}

export interface CreateErgBrandInput {
  name: string
}

export interface UpdateErgBrandInput {
  name?: string
}

export interface Facility {
  id: number
  name: string
  city: string
  postalCode: string
  streetAddress: string
  numberOfErgs: number
  chainName: string | null
  ergBrandName: string | null
  extraInformation: string | null
  externalUrl: string | null
}

export interface CreateFacilityInput {
  name: string
  city: string
  postalCode: string
  streetAddress: string
  numberOfErgs: number
  chainId?: number | null
  ergBrandId?: number | null
  extraInformation?: string | null
  externalUrl?: string | null
}

export interface UpdateFacilityInput {
  name?: string
  city?: string
  postalCode?: string
  streetAddress?: string
  numberOfErgs?: number
  chainId?: number | null
  ergBrandId?: number | null
  extraInformation?: string | null
  externalUrl?: string | null
}

