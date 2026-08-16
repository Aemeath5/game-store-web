export type InventoryCategory = 'material' | 'furniture' | 'equip' | 'weapon' | 'reliquary' | 'unknown'

export interface PlayerCurrency {
  primogem: number
  mora: number
  genesis_crystal?: number | null
}

export interface PlayerInventoryItem {
  item_key: string
  guid?: string
  item_id: number
  item_type: number
  category: InventoryCategory | string
  count: number
  level?: number
  exp?: number
  promote_level?: number
  refine_level?: number
  locked?: boolean
  main_prop_id?: number
  append_prop_ids?: number[]
}

export interface PlayerInventoryPage {
  page: number
  page_size: number
  total: number
  items: PlayerInventoryItem[]
}

export interface PlayerSnapshot {
  uid: number
  nickname: string
  data_version: number
  currency: PlayerCurrency
  inventory: PlayerInventoryPage
  snapshot_time: number
  source: string
}
