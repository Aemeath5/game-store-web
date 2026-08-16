import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'

const iconDirectory = resolve(process.argv[2] ?? 'public/game-assets/icons')
const minimumSize = Number.parseInt(process.argv[3] ?? '256', 10)

if (!Number.isSafeInteger(minimumSize) || minimumSize < 1)
  throw new Error(`Invalid minimum icon size: ${process.argv[3]}`)

async function findWebpFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory())
      files.push(...await findWebpFiles(path))
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.webp'))
      files.push(path)
  }

  return files
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16)
}

function readWebpDimensions(buffer) {
  if (buffer.length < 20 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP')
    throw new Error('invalid RIFF/WEBP header')

  let offset = 12
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString('ascii', offset, offset + 4)
    const chunkSize = buffer.readUInt32LE(offset + 4)
    const dataOffset = offset + 8

    if (dataOffset + chunkSize > buffer.length)
      throw new Error(`truncated ${type} chunk`)

    if (type === 'VP8X' && chunkSize >= 10) {
      return {
        width: readUInt24LE(buffer, dataOffset + 4) + 1,
        height: readUInt24LE(buffer, dataOffset + 7) + 1,
      }
    }

    if (type === 'VP8 ' && chunkSize >= 10) {
      if (buffer[dataOffset + 3] !== 0x9d || buffer[dataOffset + 4] !== 0x01 || buffer[dataOffset + 5] !== 0x2a)
        throw new Error('invalid VP8 frame header')
      return {
        width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff,
      }
    }

    if (type === 'VP8L' && chunkSize >= 5) {
      if (buffer[dataOffset] !== 0x2f)
        throw new Error('invalid VP8L signature')
      const bits = buffer.readUInt32LE(dataOffset + 1)
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1,
      }
    }

    offset = dataOffset + chunkSize + (chunkSize % 2)
  }

  throw new Error('WebP image chunk not found')
}

let files
try {
  files = (await findWebpFiles(iconDirectory)).sort()
}
catch (error) {
  console.error(`Game icon directory is unavailable: ${iconDirectory}`)
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

if (files.length === 0) {
  console.error(`No WebP icons found in ${iconDirectory}`)
  process.exit(1)
}

const undersized = []
const invalid = []
let aliasSummary = ''

for (const file of files) {
  try {
    const dimensions = readWebpDimensions(await readFile(file))
    if (dimensions.width < minimumSize || dimensions.height < minimumSize)
      undersized.push({ file, ...dimensions })
  }
  catch (error) {
    invalid.push({ file, message: error instanceof Error ? error.message : String(error) })
  }
}

try {
  const assetDirectory = resolve(iconDirectory, '..')
  const index = JSON.parse(await readFile(resolve(assetDirectory, 'index.json'), 'utf8'))
  const aliases = JSON.parse(await readFile(resolve(assetDirectory, 'reliquary-aliases.json'), 'utf8'))
  const fileSet = new Set(files)
  const restoredIcons = new Set(aliases.restored_icons)

  for (const iconKey of restoredIcons) {
    const path = resolve(iconDirectory, `${iconKey}.webp`)
    if (!fileSet.has(path))
      invalid.push({ file: path, message: 'restored reliquary icon is missing' })
  }

  for (const [itemID, sourceID] of Object.entries(aliases.aliases)) {
    if (index.items[itemID])
      invalid.push({ file: `reliquary alias ${itemID}`, message: 'alias unexpectedly replaces an indexed item' })
    const source = index.items[sourceID]
    if (!source)
      invalid.push({ file: `reliquary alias ${itemID}`, message: `source item ${sourceID} is missing` })
    else if (!source.icon && !restoredIcons.has(source.icon_key))
      invalid.push({ file: `reliquary alias ${itemID}`, message: `source item ${sourceID} has no usable icon` })
  }

  for (const [itemID, fallback] of Object.entries(aliases.fallbacks)) {
    if (!fallback.name || fallback.kind !== 'reliquary' || !fallback.icon)
      invalid.push({ file: `reliquary fallback ${itemID}`, message: 'fallback metadata is incomplete' })
  }

  aliasSummary = `, ${Object.keys(aliases.aliases).length} reliquary aliases and ${Object.keys(aliases.fallbacks).length} fallbacks`
}
catch (error) {
  invalid.push({
    file: resolve(iconDirectory, '..', 'reliquary-aliases.json'),
    message: error instanceof Error ? error.message : String(error),
  })
}

if (undersized.length === 0 && invalid.length === 0) {
  console.log(`Validated ${files.length} WebP icons${aliasSummary}: every image is at least ${minimumSize}x${minimumSize}.`)
  process.exit(0)
}

console.error(`Game icon validation failed: ${undersized.length} below ${minimumSize}x${minimumSize}, ${invalid.length} invalid.`)

for (const item of undersized.slice(0, 50))
  console.error(`- ${item.width}x${item.height} ${relative(process.cwd(), item.file)}`)
if (undersized.length > 50)
  console.error(`- ...and ${undersized.length - 50} more undersized icons`)

for (const item of invalid.slice(0, 50))
  console.error(`- invalid ${relative(process.cwd(), item.file)}: ${item.message}`)
if (invalid.length > 50)
  console.error(`- ...and ${invalid.length - 50} more invalid icons`)

process.exit(1)
