import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="flex flex-col gap-space-xl p-4 sm:p-6 lg:p-space-xl max-w-7xl mx-auto animate-in fade-in duration-150">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface rounded-2xl p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between h-36">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="w-10 h-10 rounded-xl" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle p-space-md flex flex-col gap-3">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-10 w-full rounded-xl" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
