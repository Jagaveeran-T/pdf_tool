import Link from "next/link";
import type { ToolMeta } from "@/config/tools";

const ICONS: Record<ToolMeta["id"], string> = {
  "image-to-pdf": "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4",
  "jpg-to-pdf": "M6 3h9l4 4v14H6zM9 14l2-2 2 2 3-3",
  "merge-pdf": "M4 4h7v7H4zM13 13h7v7h-7zM11 7.5h2.5a2 2 0 012 2V13",
  "split-pdf": "M12 3v18M5 7h4M5 12h4M5 17h4M15 7h4M15 12h4M15 17h4",
  "compress-pdf": "M4 4l6 6M10 6v4H6M20 4l-6 6M14 6v4h4M4 20l6-6M10 18v-4H6M20 20l-6-6M14 18v-4h4",
};

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={tool.path}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-surface-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONS[tool.id]} />
        </svg>
      </span>
      <h3 className="text-lg font-semibold text-ink group-hover:text-brand-700">{tool.name}</h3>
      <p className="text-sm leading-6 text-ink-soft">{tool.shortDescription}</p>
      <span className="mt-auto text-sm font-semibold text-brand-700">Open tool →</span>
    </Link>
  );
}
