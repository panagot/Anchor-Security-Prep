import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel">
      <div className="panel-inner space-y-4">
        <p className="label">404</p>
        <h1 className="display text-2xl font-bold">Page not found</h1>
        <Link href="/" className="btn btn-primary inline-flex">Back to home</Link>
      </div>
    </div>
  );
}
