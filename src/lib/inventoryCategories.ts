import type { GameAssetItem } from '@/lib/gameAssets'
import type { PlayerInventoryItem } from '@/types/player'

export interface InventoryCategoryMeta {
  label: string
  image: string
  order: number
}

export const inventoryCategoryPresentation = {
  currency: { label: '货币资源', image: '/assets/reference/primogem.svg', order: 10 },
  'weapon-sword': { label: '单手剑', image: '/assets/reference/item-flower.svg', order: 20 },
  'weapon-claymore': { label: '双手剑', image: '/assets/reference/item-flower.svg', order: 21 },
  'weapon-pole': { label: '长柄武器', image: '/assets/reference/item-flower.svg', order: 22 },
  'weapon-catalyst': { label: '法器', image: '/assets/reference/item-flower.svg', order: 23 },
  'weapon-bow': { label: '弓', image: '/assets/reference/item-flower.svg', order: 24 },
  weapon: { label: '其他武器', image: '/assets/reference/item-flower.svg', order: 25 },
  'reliquary-flower': { label: '生之花', image: '/assets/reference/item-mask.svg', order: 30 },
  'reliquary-plume': { label: '死之羽', image: '/assets/reference/item-mask.svg', order: 31 },
  'reliquary-sands': { label: '时之沙', image: '/assets/reference/item-mask.svg', order: 32 },
  'reliquary-goblet': { label: '空之杯', image: '/assets/reference/item-mask.svg', order: 33 },
  'reliquary-circlet': { label: '理之冠', image: '/assets/reference/item-mask.svg', order: 34 },
  reliquary: { label: '其他圣遗物', image: '/assets/reference/item-mask.svg', order: 35 },
  'avatar-development': { label: '角色养成', image: '/assets/reference/avatar-main.svg', order: 40 },
  'weapon-development': { label: '武器养成', image: '/assets/reference/item-flower.svg', order: 41 },
  'reliquary-development': { label: '圣遗物养成', image: '/assets/reference/item-mask.svg', order: 42 },
  food: { label: '食物料理', image: '/assets/reference/item-orb.svg', order: 50 },
  material: { label: '普通材料', image: '/assets/reference/item-orb.svg', order: 51 },
  consumable: { label: '消耗品', image: '/assets/reference/item-snow.svg', order: 52 },
  reward: { label: '礼包宝箱', image: '/assets/reference/item-snow.svg', order: 53 },
  gadget: { label: '小道具', image: '/assets/reference/item-blue.svg', order: 60 },
  quest: { label: '任务道具', image: '/assets/reference/item-dragon.svg', order: 61 },
  cosmetic: { label: '外观收藏', image: '/assets/reference/avatar-2.svg', order: 62 },
  furniture: { label: '摆设', image: '/assets/reference/item-blue.svg', order: 70 },
  'home-material': { label: '尘歌壶材料', image: '/assets/reference/item-blue.svg', order: 71 },
  gcg: { label: '七圣召唤', image: '/assets/reference/item-snow.svg', order: 80 },
  equip: { label: '其他装备', image: '/assets/reference/item-snow.svg', order: 90 },
  unknown: { label: '其他道具', image: '/assets/reference/item-dragon.svg', order: 99 },
} as const satisfies Record<string, InventoryCategoryMeta>

export type InventoryDisplayCategory = keyof typeof inventoryCategoryPresentation

const weaponCategories: Record<string, InventoryDisplayCategory> = {
  WEAPON_SWORD_ONE_HAND: 'weapon-sword',
  WEAPON_CLAYMORE: 'weapon-claymore',
  WEAPON_POLE: 'weapon-pole',
  WEAPON_CATALYST: 'weapon-catalyst',
  WEAPON_BOW: 'weapon-bow',
}

const reliquaryCategories: Record<string, InventoryDisplayCategory> = {
  EQUIP_BRACER: 'reliquary-flower',
  EQUIP_NECKLACE: 'reliquary-plume',
  EQUIP_SHOES: 'reliquary-sands',
  EQUIP_RING: 'reliquary-goblet',
  EQUIP_DRESS: 'reliquary-circlet',
}

const avatarDevelopmentTypes = new Set([
  'MATERIAL_AVATAR',
  'MATERIAL_AVATAR_MATERIAL',
  'MATERIAL_AVATAR_TALENT_MATERIAL',
  'MATERIAL_EXP_FRUIT',
  'MATERIAL_FIRE_MASTER_AVATAR_TALENT_ITEM',
  'MATERIAL_RARE_GROWTH_MATERIAL',
  'MATERIAL_TALENT',
])

const foodTypes = new Set([
  'MATERIAL_FOOD',
  'MATERIAL_NOTICE_ADD_HP',
  'MATERIAL_SPICE_FOOD',
])

const homeMaterialTypes = new Set([
  'MATERIAL_FURNITURE_FORMULA',
  'MATERIAL_FURNITURE_SUITE_FORMULA',
  'MATERIAL_HOME_SEED',
  'MATERIAL_WOOD',
])

const cosmeticTypes = new Set([
  'MATERIAL_AVATAR_TRACE',
  'MATERIAL_BGM',
  'MATERIAL_COSTUME',
  'MATERIAL_FLYCLOAK',
  'MATERIAL_MUSIC_GAME_BOOK_THEME',
  'MATERIAL_NAMECARD',
  'MATERIAL_PHOTOGRAPH_POSE',
  'MATERIAL_PROFILE_FRAME',
  'MATERIAL_PROFILE_PICTURE',
  'MATERIAL_TPS_CLOAK_UPGRADE',
  'MATERIAL_WEAPON_SKIN',
])

const gadgetTypes = new Set([
  'MATERIAL_ACTIVITY_GEAR',
  'MATERIAL_ACTIVITY_JIGSAW',
  'MATERIAL_ACTIVITY_ROBOT',
  'MATERIAL_CHANNELLER_SLAB_BUFF',
  'MATERIAL_CRICKET',
  'MATERIAL_FIREWORKS',
  'MATERIAL_FISH_BAIT',
  'MATERIAL_FISH_ROD',
  'MATERIAL_RENAME_ITEM',
  'MATERIAL_SEA_LAMP',
  'MATERIAL_TPS_ACCESSORY',
  'MATERIAL_WIDGET',
])

const questTypes = new Set([
  'MATERIAL_ARANARA',
  'MATERIAL_BRONZE_CARRIAGE_BOX',
  'MATERIAL_BUBBLE_DRAMA_INVITE',
  'MATERIAL_CLUE_SHOP_HANDBOOK',
  'MATERIAL_DESHRET_MANUAL',
  'MATERIAL_GREATEFESTIVALV2_INVITE',
  'MATERIAL_HOLIDAY_MEMORY_BOOK',
  'MATERIAL_HOLIDAY_RESORT_INVITE',
  'MATERIAL_LANV5_PAIMON_GREETING_CARD',
  'MATERIAL_MAGIC_STORY_BOOK',
  'MATERIAL_MARIONETTE_TEA_TIME_INVITE',
  'MATERIAL_MIKAWA_FLOWER_INVITE',
  'MATERIAL_MOON_NIGHT_CARD',
  'MATERIAL_NATLAN_RACE_ALBUM',
  'MATERIAL_NATLAN_RACE_ENVELOPE',
  'MATERIAL_NATLAN_RELATION_A',
  'MATERIAL_NATLAN_RELATION_B',
  'MATERIAL_NATURALIST_CODEX',
  'MATERIAL_ODETTE_QUEST_PHOTO_BOOK',
  'MATERIAL_PHOTO_DISPLAY_BOOK',
  'MATERIAL_PHOTOV5_HAND_BOOK',
  'MATERIAL_PHOTOV6_HAND_BOOK',
  'MATERIAL_QUEST_ALBUM',
  'MATERIAL_QUEST_EVENT_BOOK',
  'MATERIAL_RAINBOW_PRINCE_HAND_BOOK',
  'MATERIAL_REMUS_MUSIC_BOX',
  'MATERIAL_ROBO_GIFT',
  'MATERIAL_ZDAQ_BOOK_PHOTO',
])

function backendFallback(category: string): InventoryDisplayCategory {
  switch (category) {
    case 'weapon':
      return 'weapon'
    case 'reliquary':
      return 'reliquary'
    case 'furniture':
      return 'furniture'
    case 'equip':
      return 'equip'
    case 'material':
      return 'material'
    default:
      return 'unknown'
  }
}

export function inventoryDisplayCategory(
  item: PlayerInventoryItem,
  asset?: GameAssetItem,
): InventoryDisplayCategory {
  if (!asset)
    return backendFallback(item.category)

  const { kind, type } = asset

  if (kind === 'weapon')
    return weaponCategories[type] ?? 'weapon'
  if (kind === 'reliquary')
    return reliquaryCategories[type] ?? 'reliquary'
  if (kind === 'furniture')
    return 'furniture'

  if (type.startsWith('MATERIAL_GCG_'))
    return 'gcg'
  if (type.includes('CHEST'))
    return 'reward'
  if (avatarDevelopmentTypes.has(type))
    return 'avatar-development'
  if (type === 'MATERIAL_WEAPON_EXP_STONE')
    return 'weapon-development'
  if (type === 'MATERIAL_RELIQUARY_MATERIAL')
    return 'reliquary-development'
  if (foodTypes.has(type))
    return 'food'
  if (homeMaterialTypes.has(type))
    return 'home-material'
  if (cosmeticTypes.has(type))
    return 'cosmetic'
  if (gadgetTypes.has(type))
    return 'gadget'
  if (type === 'MATERIAL_QUEST' || questTypes.has(type))
    return 'quest'
  if (type === 'ITEM_VIRTUAL' || type === 'MATERIAL_ADSORBATE' || type === 'MATERIAL_FAKE_ABSORBATE')
    return 'currency'
  if (type === 'MATERIAL_CONSUME' || type === 'MATERIAL_CONSUME_BATCH_USE')
    return 'consumable'
  if (kind === 'material')
    return 'material'

  return backendFallback(item.category)
}

export function inventoryCategoryMeta(category: InventoryDisplayCategory) {
  return inventoryCategoryPresentation[category]
}
