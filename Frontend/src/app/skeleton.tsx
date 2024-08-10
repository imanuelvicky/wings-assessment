import { Skeleton } from '@nextui-org/react'

export default function DashboardSkeleton() {
  return (
    <div>
      <Skeleton className={`relative mb-4 h-8 w-1/4 overflow-hidden rounded-md bg-gray-100`} />
      <div className="relative grid gap-52 grid-cols-2 pt-4 ">
        <Skeleton className="h-8 rounded-lg" />
        <div className="grid gap-6 grid-cols-2">
          <Skeleton className="h-8 rounded-lg" />
          <Skeleton className="h-8 rounded-lg" />
        </div>
      </div>
      <Skeleton className={`relative my-4 h-8 w-1/4 overflow-hidden rounded-md bg-gray-100`} />

      <div className="relative mt-4 h-[60vh] w-full overflow-hidden rounded-md bg-gray-100">
        <div className="grid gap-6 grid-cols-5 p-4">
          <Skeleton className={`relative h-8 overflow-hidden rounded-md bg-gray-100`} />
          <Skeleton className={`relative h-8 overflow-hidden rounded-md bg-gray-100`} />
          <Skeleton className={`relative h-8 overflow-hidden rounded-md bg-gray-100`} />
          <Skeleton className={`relative h-8 overflow-hidden rounded-md bg-gray-100`} />
          <Skeleton className={`relative h-8 overflow-hidden rounded-md bg-gray-100`} />
        </div>
        <div className="p-4 h-full overflow-auto">
          <Skeleton className={`h-[100%] relative overflow-hidden rounded-md bg-gray-100`} />
        </div>
      </div>
    </div>
  )
}
