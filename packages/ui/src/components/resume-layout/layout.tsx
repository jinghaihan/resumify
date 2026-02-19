import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import type { SectionDistribution } from '@resumify/shared'
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
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useIsMounted } from '@resumify/shared'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ResumeColumn } from './column'

interface ResumeLayoutProps {
  columns: SectionDistribution
  renderColumn?: (id: string, children: React.ReactNode) => React.ReactNode
  renderSection: (id: string) => React.ReactNode
  onChange?: (columns: SectionDistribution) => void
  draggable?: boolean
}

export function ResumeLayout({
  columns,
  renderColumn,
  renderSection,
  onChange,
  draggable = true,
}: ResumeLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const isMounted = useIsMounted()

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  )

  const columnIds = Object.keys(columns)

  const findColumnOfSection = (sectionId: string): string | null => {
    return Object.entries(columns).find(([, sections]) => sections.includes(sectionId))?.[0] ?? null
  }

  const renderColumnContent = (columnId: string, children: React.ReactNode): React.ReactNode => {
    if (renderColumn) {
      return renderColumn(columnId, children)
    }

    const columnWidth = (100 / columnIds.length).toFixed(2)
    return (
      <div
        key={columnId}
        style={{ width: `${columnWidth}%` }}
      >
        {children}
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over)
      return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumnOfSection(activeId)
    const overColumn = findColumnOfSection(overId) ?? overId

    if (!activeColumn || !overColumn || activeColumn === overColumn)
      return

    const newColumns = { ...columns }
    newColumns[activeColumn] = newColumns[activeColumn].filter(id => id !== activeId)

    const isOverColumn = columnIds.includes(overId)
    const overIndex = newColumns[overColumn].indexOf(overId)
    const isBelowOverItem = over
      && active.rect.current.translated
      && active.rect.current.translated.top > over.rect.top + over.rect.height

    const newIndex = isOverColumn
      ? newColumns[overColumn].length
      : (overIndex >= 0 ? overIndex + (isBelowOverItem ? 1 : 0) : newColumns[overColumn].length)

    newColumns[overColumn] = [
      ...newColumns[overColumn].slice(0, newIndex),
      activeId,
      ...newColumns[overColumn].slice(newIndex),
    ]

    onChange?.(newColumns)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)

    const { active, over } = event
    if (!over)
      return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumnOfSection(activeId)
    const overColumn = findColumnOfSection(overId)

    if (!activeColumn || !overColumn)
      return

    if (activeColumn === overColumn) {
      const oldIndex = columns[activeColumn].indexOf(activeId)
      const newIndex = columns[overColumn].indexOf(overId)

      if (oldIndex !== newIndex) {
        onChange?.({
          ...columns,
          [activeColumn]: arrayMove(columns[activeColumn], oldIndex, newIndex),
        })
      }
    }
  }

  // Static (non-draggable) layout
  if (!draggable) {
    return (
      <div className="flex">
        {columnIds.map(columnId => (
          renderColumnContent(
            columnId,
            <div key={columnId}>
              {columns[columnId].map(sectionId => (
                <div key={sectionId}>{renderSection(sectionId)}</div>
              ))}
            </div>,
          )
        ))}
      </div>
    )
  }

  // Draggable layout
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
        <div className="flex">
          {columnIds.map(columnId => (
            renderColumnContent(
              columnId,
              <ResumeColumn key={columnId} id={columnId} sections={columns[columnId]} renderSection={renderSection} />,
            )
          ))}
        </div>
      </SortableContext>

      {isMounted() && createPortal(
        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeId != null && <div className="light">{renderSection(activeId)}</div>}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
