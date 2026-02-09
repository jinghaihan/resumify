import type { StreamdownProps } from 'streamdown'
import { cjk } from '@streamdown/cjk'
import { code } from '@streamdown/code'
import { math } from '@streamdown/math'
import { mermaid } from '@streamdown/mermaid'
import { Streamdown } from 'streamdown'

import { githubMarkdownComponents } from './styles/github'

export type Typography = 'github'

export type MarkdownProps = {
  /**
   * Markdown content to render
   */
  children: string

  /**
   * Typography style to use
   * @default 'github'
   */
  style?: Typography

  /**
   * Custom components to override default markdown rendering
   * If provided, overrides the style components
   */
  components?: StreamdownProps['components']

  /**
   * Wrapper class name
   */
  className?: string
} & Omit<StreamdownProps, 'plugins'>

const DEFAULT_PLUGINS = {
  code,
  mermaid,
  math,
  cjk,
}

const TYPOGRAPHY_STYLES: Record<Typography, StreamdownProps['components']> = {
  github: githubMarkdownComponents,
}

export function Markdown({ children, style = 'github', components, className, ...props }: MarkdownProps) {
  const styleComponents = components || TYPOGRAPHY_STYLES[style]

  return (
    <Streamdown
      plugins={DEFAULT_PLUGINS}
      components={styleComponents}
      className={className}
      {...props}
    >
      {children}
    </Streamdown>
  )
}

// Re-export style components for direct use if needed
export { githubMarkdownComponents }
