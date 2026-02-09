import { AddButton } from '@resumify/ui'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shadcn/components/ui/card'

interface AddableCardProps {
  title: string
  description: string
  addButtonText?: string
  action?: React.ReactNode
  children: React.ReactNode
  onAdd: () => void
}

export function AddableCard({
  title,
  description,
  addButtonText,
  action,
  children,
  onAdd,
}: AddableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && (
          <CardAction>
            {action}
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter>
        <AddButton text={addButtonText} onAdd={onAdd} />
      </CardFooter>
    </Card>
  )
}
