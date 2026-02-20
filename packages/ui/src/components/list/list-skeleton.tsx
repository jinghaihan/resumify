import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn/components/ui/card'
import { Skeleton } from '@shadcn/components/ui/skeleton'

interface ListSkeletonProps {
  count?: number
}

export function ListSkeleton({ count = 5 }: ListSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="py-3 pl-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-40" />
            </CardTitle>
            <CardAction className="text-muted-foreground">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-sm" />
                <Skeleton className="size-5 rounded-sm" />
                <Skeleton className="size-5 rounded-sm" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
