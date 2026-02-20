import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ResumeSection } from './section'

interface ResumeColumnProps {
  id: string
  sections: string[]
  renderSection: (id: string) => React.ReactNode
}

export function ResumeColumn({ id, sections, renderSection }: ResumeColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const style = {
    backgroundColor: isOver ? 'var(--muted)' : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <SortableContext
        items={sections}
        strategy={verticalListSortingStrategy}
      >
        {sections.map(sectionId => (
          <ResumeSection key={sectionId} id={sectionId}>
            {renderSection(sectionId)}
          </ResumeSection>
        ))}
      </SortableContext>
    </div>
  )
}
