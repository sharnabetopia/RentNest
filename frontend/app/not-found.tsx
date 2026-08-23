import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-black text-brand-600">404</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <Link href="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    </div>
  );
}
