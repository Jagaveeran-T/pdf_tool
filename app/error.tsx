"use client";
import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-prose px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-3 text-ink-soft">The page hit an unexpected problem. Your files were never uploaded, so nothing was lost on a server. Try again, or go back to the home page.</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn btn-secondary">Go to the home page</Link>
      </div>
    </div>
  );
}
