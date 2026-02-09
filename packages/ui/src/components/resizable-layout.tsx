import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@shadcn/components/ui/resizable'

interface ResizableLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function ResizableLayout({ sidebar, children }: ResizableLayoutProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 overflow-hidden"
    >
      <ResizablePanel defaultSize={30} minSize={30}>
        {sidebar}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70} minSize={50}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
