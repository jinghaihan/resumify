import { differenceInDays, differenceInHours, format, formatDistanceToNow, isPast, parseISO } from 'date-fns'

import { SHARE_EXPIRATION_TIME_OPTIONS } from '../constants'

export function parseDate(dateString: string | null): Date | null {
  if (!dateString)
    return null
  const date = parseISO(dateString)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Format a date string to a localized datetime string
 * Format: "Jan 1, 2024, 2:30 PM"
 */
export function formatDateTime(dateString: string | Date): string {
  return format(dateString, 'MMM d, yyyy, h:mm a')
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date | number): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

export function isExpired(dateString: string | null | undefined): boolean {
  if (!dateString)
    return false
  const date = parseISO(dateString)
  return isPast(date)
}

/**
 * Calculate expiration date from preset
 */
export function getExpirationDate(preset: string, customDate?: string): Date | null {
  if (preset === 'never')
    return null

  if (preset === 'custom' && customDate) {
    const date = parseISO(customDate)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const presetOption = SHARE_EXPIRATION_TIME_OPTIONS.find(option => option.value === preset)
  if (!presetOption)
    return null

  return presetOption.getExpirationDate()
}

/**
 * Get expiration preset value from expiration date
 * Returns 'never', '1h', '24h', '7d', '30d', or 'custom'
 */
export function getExpirationPreset(expirationDate: string | Date | null): string {
  if (!expirationDate)
    return 'never'

  const date = typeof expirationDate === 'string' ? parseISO(expirationDate) : expirationDate
  if (!date || Number.isNaN(date.getTime()))
    return 'never'

  const now = new Date()
  const hours = differenceInHours(date, now)
  const days = differenceInDays(date, now)

  if (hours <= 1)
    return '1h'
  if (hours <= 24)
    return '24h'
  if (days <= 7)
    return '7d'
  if (days <= 30)
    return '30d'
  return 'custom'
}
