export function isBrowser() {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined'
}

export function capitalize(str: string) {
  if (str.length === 0)
    return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function save(data: BlobPart, mimeType: string, name: string) {
  const blob = new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function normalizeFilename(filename: string, extension: string) {
  if (!filename.endsWith(extension))
    return `${filename}.${extension}`
  return filename
}
