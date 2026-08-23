export function PageSkeleton() {
  return (
    <div className="container-page py-10">
      <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="h-52 animate-pulse bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
