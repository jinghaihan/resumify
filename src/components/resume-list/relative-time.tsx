import { formatRelativeTime } from '@resumify/shared'

interface RelativeTimeProps {
  date: string | Date | number | null
}

export function RelativeTime({ date }: RelativeTimeProps) {
  return (
    formatRelativeTime(date ? new Date(date) : new Date())
  )
}
