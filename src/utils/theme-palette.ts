export const GRAY_PALETTE_STORAGE_KEY = "theme-gray"
export const PRIMARY_PALETTE_STORAGE_KEY = "theme-primary"

export const GRAY_PALETTE_OPTIONS = [
  "color-gray-gray",
  "color-gray-mauve",
  "color-gray-slate",
  "color-gray-sage",
  "color-gray-olive",
  "color-gray-sand",
] as const

/* Sorted by hue following the Radix Colors palette order, not alphabetically. */
export const PRIMARY_PALETTE_OPTIONS = [
  "color-primary-orange",
  "color-primary-tomato",
  "color-primary-red",
  "color-primary-ruby",
  "color-primary-crimson",
  "color-primary-pink",
  "color-primary-plum",
  "color-primary-purple",
  "color-primary-violet",
  "color-primary-iris",
  "color-primary-indigo",
  "color-primary-blue",
  "color-primary-cyan",
  "color-primary-teal",
  "color-primary-jade",
  "color-primary-green",
  "color-primary-grass",
  "color-primary-bronze",
  "color-primary-gold",
  "color-primary-brown",
  // "color-primary-amber",
  // "color-primary-yellow",
  // "color-primary-lime",
  // "color-primary-mint",
  // "color-primary-sky",
] as const

export type GrayPalette = (typeof GRAY_PALETTE_OPTIONS)[number]
export type PrimaryPalette = (typeof PRIMARY_PALETTE_OPTIONS)[number]

export const DEFAULT_GRAY_PALETTE: GrayPalette = "color-gray-mauve"
export const DEFAULT_PRIMARY_PALETTE: PrimaryPalette = "color-primary-crimson"

/*
    Natural pairing from Radix Colors: each accent scale is designed to sit on a specific
    gray scale (e.g. Red on Mauve, Green on Sage, Blue on Slate).
*/
const PRIMARY_TO_GRAY_PALETTE: Record<PrimaryPalette, GrayPalette> = {
  "color-primary-blue": "color-gray-slate",
  "color-primary-bronze": "color-gray-sand",
  "color-primary-brown": "color-gray-sand",
  "color-primary-crimson": "color-gray-mauve",
  "color-primary-cyan": "color-gray-slate",
  "color-primary-gold": "color-gray-sand",
  "color-primary-grass": "color-gray-olive",
  "color-primary-green": "color-gray-sage",
  "color-primary-indigo": "color-gray-slate",
  "color-primary-iris": "color-gray-slate",
  "color-primary-jade": "color-gray-sage",
  "color-primary-orange": "color-gray-sand",
  "color-primary-pink": "color-gray-mauve",
  "color-primary-plum": "color-gray-mauve",
  "color-primary-purple": "color-gray-mauve",
  "color-primary-red": "color-gray-mauve",
  "color-primary-ruby": "color-gray-mauve",
  "color-primary-teal": "color-gray-sage",
  "color-primary-tomato": "color-gray-mauve",
  "color-primary-violet": "color-gray-mauve",
}

export function getPairedGrayPalette(palette: PrimaryPalette): GrayPalette {
  return PRIMARY_TO_GRAY_PALETTE[palette]
}

const LAST_SEGMENT_INDEX = -1

export function formatPrimaryPaletteLabel(palette: PrimaryPalette): string {
  const colorName = palette.split("-").at(LAST_SEGMENT_INDEX) ?? palette
  return colorName.charAt(0).toUpperCase() + colorName.slice(1)
}

export function getPaletteColorName(palette: GrayPalette | PrimaryPalette): string {
  return palette.split("-").at(LAST_SEGMENT_INDEX) ?? palette
}

export function readStoredGrayPalette(): GrayPalette {
  const stored = localStorage.getItem(GRAY_PALETTE_STORAGE_KEY)
  return isGrayPalette(stored) ? stored : DEFAULT_GRAY_PALETTE
}

export function readStoredPrimaryPalette(): PrimaryPalette {
  const stored = localStorage.getItem(PRIMARY_PALETTE_STORAGE_KEY)
  return isPrimaryPalette(stored) ? stored : DEFAULT_PRIMARY_PALETTE
}

function isGrayPalette(value: unknown): value is GrayPalette {
  return GRAY_PALETTE_OPTIONS.includes(value as GrayPalette)
}

function isPrimaryPalette(value: unknown): value is PrimaryPalette {
  return PRIMARY_PALETTE_OPTIONS.includes(value as PrimaryPalette)
}
