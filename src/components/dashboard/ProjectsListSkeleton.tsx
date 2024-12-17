import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProjectsListSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="w-8 h-8 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-2 w-20" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 