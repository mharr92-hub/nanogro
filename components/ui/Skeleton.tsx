export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={["skeleton", className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

/** Esqueleto de una Ficha de Evidencia, para los loading.tsx de listados. */
export function EvidenceSheetSkeleton() {
  return (
    <div className="sheet p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-6 w-4/5" />
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 pt-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
      <Skeleton className="mt-5 h-11 w-full" />
    </div>
  );
}

export function SheetGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <EvidenceSheetSkeleton key={index} />
      ))}
    </div>
  );
}
