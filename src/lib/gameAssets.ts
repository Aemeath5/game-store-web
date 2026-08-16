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

interface ReliquaryAliases {
  version: number
  reliquary_meta_sha: string
  restored_icons: string[]
  aliases: Record<string, string>
  fallbacks: Record<string, GameAssetItem>
}

let indexPromise: Promise<GameAssetIndex> | null = null

function applyReliquaryAliases(index: GameAssetIndex, aliases: ReliquaryAliases) {
  const restoredIcons = new Set(aliases.restored_icons)

  for (const item of Object.values(index.items)) {
    if (!item.icon && restoredIcons.has(item.icon_key))
      item.icon = `/game-assets/icons/${item.icon_key}.webp`
  }

  for (const [itemID, sourceID] of Object.entries(aliases.aliases)) {
    const source = index.items[sourceID]
    if (source)
      index.items[itemID] = { ...source }
  }

  Object.assign(index.items, aliases.fallbacks)
  index.item_count = Object.keys(index.items).length
  index.icon_count = new Set(Object.values(index.items).map(item => item.icon).filter(Boolean)).size
  return index
}

export function loadGameAssetIndex() {
  if (!indexPromise) {
    indexPromise = Promise.all([
      fetch('/game-assets/index.json'),
      fetch('/game-assets/reliquary-aliases.json'),
    ])
      .then(async ([indexResponse, aliasesResponse]) => {
        if (!indexResponse.ok)
          throw new Error(`图鉴资源加载失败（${indexResponse.status}）`)
        if (!aliasesResponse.ok)
          throw new Error(`圣遗物映射加载失败（${aliasesResponse.status}）`)

        const [index, aliases] = await Promise.all([
          indexResponse.json() as Promise<GameAssetIndex>,
          aliasesResponse.json() as Promise<ReliquaryAliases>,
        ])
        return applyReliquaryAliases(index, aliases)
      })
      .catch((error) => {
        indexPromise = null
        throw error
      })
  }
  return indexPromise
}
