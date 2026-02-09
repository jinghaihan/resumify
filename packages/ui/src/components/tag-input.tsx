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
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@shadcn/components/ui/badge'
import { Input } from '@shadcn/components/ui/input'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useImperativeHandle, useState } from 'react'

export interface TagInputRef {
  clearInput: () => void
  focus: () => void
}

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
}

interface SortableTagProps {
  tag: string
  onRemove: () => void
  disabled?: boolean
}

function SortableTag({ tag, onRemove, disabled }: SortableTagProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Badge
        variant="secondary"
        {...attributes}
        {...listeners}
      >
        {tag}
        <button
          type="button"
          className="
            cursor-pointer text-muted-foreground
            hover:bg-muted hover:text-foreground
          "
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <XIcon className="size-3" />
        </button>
      </Badge>
    </div>
  )
}

export function TagInput({ ref, value = [], onChange, placeholder, disabled = false, maxLength }: TagInputProps & { ref?: React.RefObject<TagInputRef | null> }) {
  const t = useTranslations()
  const [inputValue, setInputValue] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    clearInput: () => setInputValue(''),
    focus: () => document.getElementById('tag-input')?.focus(),
  }), [])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  )

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || value.includes(trimmed)) {
      return
    }
    if (maxLength && value.length >= maxLength) {
      return
    }
    onChange([...value, trimmed])
  }, [value, onChange, maxLength])

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }, [value, onChange])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over)
      return

    const activeId = active.id as string
    const overId = over.id as string

    const oldIndex = value.indexOf(activeId)
    const newIndex = value.indexOf(overId)

    if (oldIndex !== newIndex) {
      const newItems = [...value]
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

    const oldIndex = value.indexOf(activeId)
    const newIndex = value.indexOf(overId)

    if (oldIndex !== newIndex) {
      const newItems = [...value]
      newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0])
      onChange(newItems)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
        setInputValue('')
      }
    }
    else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={value}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-2">
            {value.map(tag => (
              <SortableTag
                key={tag}
                tag={tag}
                onRemove={() => removeTag(tag)}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId && (
            <div className="cursor-grabbing opacity-50">
              <Badge variant="secondary">{activeId}</Badge>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Input
        id="tag-input"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder || t('tag-input.placeholder')}
        disabled={disabled || (maxLength !== undefined && value.length >= maxLength)}
      />
      {maxLength !== undefined && value.length >= maxLength && (
        <p className="text-xs text-muted-foreground">
          {t('tag-input.max-length-reached')}
        </p>
      )}
    </div>
  )
}

TagInput.displayName = 'TagInput'
