import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-space-xl p-4 sm:p-6 lg:p-space-xl max-w-7xl mx-auto animate-in fade-in duration-150">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <div className="bg-surface rounded-2xl p-space-xl shadow-sm border border-border-subtle flex flex-col gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <div className="bg-surface rounded-2xl p-space-xl shadow-sm border border-border-subtle flex flex-col gap-4">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
