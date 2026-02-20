import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@resumify/shared'
import { useState } from 'react'
import { Result } from '../result'
import { SortableItem } from './item'

interface SortableListProps {
  className?: string
  items: string[]
  renderItem: (
    id: string,
    index: number,
    dragHandle: React.ReactNode,
    deleteButton: React.ReactNode,
  ) => React.ReactNode
  onClose: (id: string) => void
  onChange: (items: string[]) => void
}

export function SortableList({
  className,
  items,
  renderItem,
  onClose,
  onChange,
}: SortableListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over)
      return

    const activeId = active.id as string
    const overId = over.id as string

    const oldIndex = items.indexOf(activeId)
    const newIndex = items.indexOf(overId)

    if (oldIndex !== newIndex) {
      const newItems = [...items]
      newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0])
      onChange(newItems)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)

    const { active, over } = event
    if (!over)
      return

    const activeId = active.id as string
    const overId = over.id as string

    const oldIndex = items.indexOf(activeId)
    const newIndex = items.indexOf(overId)

    if (oldIndex !== newIndex) {
      const newItems = [...items]
      newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0])
      onChange(newItems)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn('flex flex-col gap-2', className)}>
          {items.length === 0 && <Result status="empty" className="p-0" />}
          {items.map((id, index) => (
            <SortableItem key={id} id={id} onClose={onClose}>
              {props => renderItem(id, index, props.dragHandle, props.deleteButton)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId
          ? (
              <div className="cursor-grabbing opacity-50">
                {renderItem(activeId, items.indexOf(activeId), null, null)}
              </div>
            )
          : null}
      </DragOverlay>
    </DndContext>
  )
}
