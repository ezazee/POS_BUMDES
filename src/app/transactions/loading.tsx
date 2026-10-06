import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="flex flex-col gap-space-xl p-4 sm:p-6 lg:p-space-xl max-w-7xl mx-auto animate-in fade-in duration-150">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-space-lg rounded-2xl bg-surface shadow-sm border border-border-subtle flex flex-col justify-between h-36">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle flex flex-col lg:flex-row justify-between gap-space-md">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <div className="flex gap-space-sm">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden p-space-md flex flex-col gap-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 px-2 border-b border-border-subtle/50">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
