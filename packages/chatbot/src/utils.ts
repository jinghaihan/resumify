import type { UIMessage } from 'ai'

export function getLastUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find(message => message.role === 'user')
  if (!lastUser)
    return ''

  return lastUser.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('\n')
    .trim()
}
