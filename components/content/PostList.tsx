import Link from "next/link";
import { postPath, type PostMeta } from "@/lib/mdx";

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {posts.map((p) => (
        <li key={`${p.kind}/${p.slug}`}>
          <Link
            href={postPath(p.kind, p.slug)}
            className="flex h-full flex-col gap-2 rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold leading-snug text-ink">{p.title}</h2>
            <p className="text-sm leading-6 text-ink-soft">{p.description}</p>
            <span className="mt-auto pt-2 text-xs text-ink-faint">{p.readingMinutes} min read</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
