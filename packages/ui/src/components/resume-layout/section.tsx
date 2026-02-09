import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@shadcn/components/ui/button'
import { GripVerticalIcon } from 'lucide-react'

interface ResumeSectionProps {
  id: string
  children: React.ReactNode
}

export function ResumeSection({ id, children }: ResumeSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div className="group relative" ref={setNodeRef} style={style}>
      <Button
        className="
          absolute top-0 left-0 -translate-x-full opacity-0 transition-opacity
          group-hover:opacity-100
        "
        variant="ghost"
        size="icon"
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
      >
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </Button>
      {children}
    </div>
  )
}
