import { SheetGridSkeleton, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <section className="section">
      <div className="container">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-10 w-3/4 max-w-xl" />
        <Skeleton className="mt-3 h-5 w-full max-w-prose" />
        <div className="mt-8">
          <SheetGridSkeleton />
        </div>
      </div>
    </section>
  );
}
