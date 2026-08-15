export interface GameAssetItem {
  name: string
  kind: string
  icon_key: string
  icon: string
  rarity: number
  type: string
}

export interface GameAssetIndex {
  game_version: string
  generator_commit: string
  item_count: number
  icon_count: number
  items: Record<string, GameAssetItem>
}

let indexPromise: Promise<GameAssetIndex> | null = null

export function loadGameAssetIndex() {
  if (!indexPromise) {
    indexPromise = fetch('/game-assets/index.json')
      .then((response) => {
        if (!response.ok)
          throw new Error(`图鉴资源加载失败（${response.status}）`)
        return response.json() as Promise<GameAssetIndex>
      })
      .catch((error) => {
        indexPromise = null
        throw error
      })
  }
  return indexPromise
}
