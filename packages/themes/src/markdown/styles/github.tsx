import type { StreamdownProps } from 'streamdown'

export const githubMarkdownComponents: StreamdownProps['components'] = {
  // Headings
  h1: ({ children }) => (
    <h1 className="
      mt-6 mb-4 border-b border-border pb-3 text-2xl font-semibold
      text-foreground
    "
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="
      mt-6 mb-4 border-b border-border pb-3 text-xl font-semibold
      text-foreground
    "
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-4 text-lg font-semibold text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-4 text-base font-semibold text-foreground">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="mt-6 mb-3 text-sm font-semibold text-foreground">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground">
      {children}
    </h6>
  ),

  // Paragraph
  p: ({ children }) => (
    <p className="mt-0 mb-4 text-sm/relaxed text-muted-foreground">
      {children}
    </p>
  ),

  // Text formatting
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

  // Links
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

  // Lists
  ul: ({ children }) => (
    <ul className="mt-0 mb-4 list-disc space-y-1 pl-8">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mt-0 mb-4 list-decimal space-y-1 pl-8">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="mt-2 text-sm/relaxed text-muted-foreground">
      {children}
    </li>
  ),

  // Code
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
      mt-0 mb-4 overflow-x-auto rounded-md border border-border bg-muted p-4
      font-mono text-xs/relaxed text-foreground
    "
    >
      {children}
    </pre>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="
      mt-0 mb-4 border-l-4 border-border pl-4 text-sm text-muted-foreground
    "
    >
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => (
    <hr className="my-6 border-t border-border" />
  ),

  // Images
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="mt-0 mb-4 h-auto max-w-full rounded-md border border-border"
      loading="lazy"
    />
  ),
}
