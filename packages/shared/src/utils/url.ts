export function normalizeUrl(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`
}

export function getNameFromUrl(url: string): string {
  try {
    const normalizedUrl = normalizeUrl(url)
    const data = new URL(normalizedUrl)
    if (url.includes('github.com'))
      return data.pathname.split('/').pop() ?? url
    return data.origin.replace(`${data.protocol}//`, '')
  }
  catch {
    return url
  }
}

export function cleanSearchParams() {
  if (typeof window === 'undefined')
    return

  window.history.replaceState({}, '', window.location.pathname)
}
