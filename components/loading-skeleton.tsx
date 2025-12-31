import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProjectSkeleton() {
  return (
    <Card className="h-[400px]">
      <CardContent className="p-0 h-full flex flex-col">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <div className="p-6 flex-1 flex flex-col">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex gap-2 mt-auto">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BlogSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4 text-sm mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  )
}
