import { Skeleton } from "@/components/ui/skeleton";

export function PaperCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SignalBadgeSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-24 rounded-full" />
    </div>
  );
}
