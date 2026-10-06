import { Skeleton } from "@/components/ui/skeleton";

export default function PosLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-space-xl max-w-7xl mx-auto animate-in fade-in duration-150">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Catalog */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          <div className="bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle flex flex-col gap-space-md">
            <Skeleton className="h-11 w-full rounded-xl" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle flex flex-col gap-3">
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="w-9 h-9 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-4 bg-surface rounded-2xl p-space-xl shadow-sm border border-border-subtle flex flex-col gap-space-md">
          <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
