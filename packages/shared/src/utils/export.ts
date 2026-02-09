import type { PaperFormat } from '../types'
import { PAPER_SIZES } from '../constants'

/**
 * Convert paper dimensions to pixels
 * Using 96 DPI standard: 1 inch = 96px, 1mm = 3.7795px
 */
export function convertToPixels(value: number, unit: 'mm' | 'in'): number {
  if (unit === 'in')
    return value * 96
  return value * 3.7795275591 // 96 / 25.4
}

export function getPaperDimensions(format: PaperFormat, landscape: boolean = false): { width: number, height: number } {
  const size = PAPER_SIZES[format]
  const width = convertToPixels(size.width, size.unit)
  const height = convertToPixels(size.height, size.unit)

  if (landscape)
    return { width: height, height: width }

  return { width, height }
}
