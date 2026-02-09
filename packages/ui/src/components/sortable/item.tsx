import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@shadcn/components/ui/button'
import { GripVerticalIcon, XIcon } from 'lucide-react'

interface SortableItemProps {
  id: string
  onClose: (id: string) => void
  children: (props: { dragHandle: React.ReactNode, deleteButton: React.ReactNode }) => React.ReactNode
}

export function SortableItem({ id, onClose, children }: SortableItemProps) {
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
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const dragHandle = (
    <Button
      variant="ghost"
      size="icon"
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
    >
      <GripVerticalIcon className="size-4 text-muted-foreground" />
    </Button>
  )

  const deleteButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onClose(id)}
    >
      <XIcon className="size-4 text-muted-foreground" />
    </Button>
  )

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragHandle, deleteButton })}
    </div>
  )
}
