"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center">
      <div className="card max-w-lg p-8 text-center">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="mt-2 text-sm text-slate-500">
          We could not load this page. Please try again.
        </p>
        <button onClick={reset} className="btn-primary mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}
