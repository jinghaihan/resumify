import { normalizeUrl } from './url'

export function parseMarkdownLink(value: string): { text: string, href: string } | null {
  const match = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

  if (!match)
    return null

  const [, text, href] = match

  return {
    text: text.trim(),
    href: normalizeUrl(href.trim()),
  }
}
