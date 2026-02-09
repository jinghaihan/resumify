import type { PhotoShape } from '../types/photo'

export const DEFAULT_PHOTO_SHAPE: PhotoShape = 'square'

export const PHOTO_SHAPES_OPTIONS: { value: PhotoShape, aspectRatio: number }[] = [
  { value: 'square', aspectRatio: 1 },
  { value: 'circle', aspectRatio: 1 },
  { value: 'inch1', aspectRatio: 25 / 35 },
  { value: 'inch2', aspectRatio: 35 / 53 },
]
