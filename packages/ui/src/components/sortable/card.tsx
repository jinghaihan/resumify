import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn/components/ui/card'

export interface SortableCardProps {
  title: string
  dragHandle: React.ReactNode
  deleteButton: React.ReactNode
  children: React.ReactNode
}

export function SortableCard({ title, dragHandle, deleteButton, children }: SortableCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          {dragHandle}
          <h3 className="text-sm">{title}</h3>
        </CardTitle>
        <CardAction>
          {deleteButton}
        </CardAction>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
