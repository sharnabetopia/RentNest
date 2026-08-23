const styles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-slate-100 text-slate-700 border-slate-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200"
};

export function StatusBadge({ status }: { status?: string | null }) {
  const value = status || "UNKNOWN";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[value] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {value.replaceAll("_", " ")}
    </span>
  );
}
