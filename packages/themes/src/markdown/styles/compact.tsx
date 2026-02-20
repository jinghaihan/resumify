import type { StreamdownProps } from 'streamdown'

export const compactMarkdownComponents: StreamdownProps['components'] = {
  h1: ({ children }) => (
    <h1 className="
      mt-4 mb-3 border-b border-border pb-2 text-xl font-semibold
      text-foreground
    "
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="
      mt-4 mb-3 border-b border-border pb-2 text-lg font-semibold
      text-foreground
    "
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-2 text-base font-semibold text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-3 mb-2 text-sm font-semibold text-foreground">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="mt-3 mb-2 text-sm font-semibold text-foreground">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="mt-3 mb-2 text-sm font-semibold text-muted-foreground">
      {children}
    </h6>
  ),

  p: ({ children }) => (
    <p className="mt-0 mb-2.5 text-sm/snug text-muted-foreground">
      {children}
    </p>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">
      {children}
    </strong>
  ),

  em: ({ children }) => (
    <em className="text-foreground italic">
      {children}
    </em>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        text-muted-foreground underline underline-offset-2
        hover:text-primary
      "
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="mt-0 mb-2.5 list-disc space-y-0.5 pl-6">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mt-0 mb-2.5 list-decimal space-y-0.5 pl-6">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="mt-1 text-sm/snug text-muted-foreground">
      {children}
    </li>
  ),

  code: ({ children }) => (
    <code className="
      rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold
      whitespace-pre-wrap text-foreground
    "
    >
      {children}
    </code>
  ),

  pre: ({ children }) => (
    <pre className="
      mt-0 mb-2.5 overflow-x-auto rounded-md border border-border bg-muted p-3
      font-mono text-xs/snug text-foreground
    "
    >
      {children}
    </pre>
  ),

  blockquote: ({ children }) => (
    <blockquote className="
      mt-0 mb-2.5 border-l-4 border-border pl-3 text-sm text-muted-foreground
    "
    >
      {children}
    </blockquote>
  ),

  hr: () => (
    <hr className="my-3 border-t border-border" />
  ),

  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="mt-0 mb-2.5 h-auto max-w-full rounded-md border border-border"
      loading="lazy"
    />
  ),
}
