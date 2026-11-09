import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { countWords } from "./wordCount";

export type ContentKind = "blog" | "guides";

export interface PostMeta {
  kind: ContentKind;
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  order: number;
  words: number;
  readingMinutes: number;
  related: string[];
}

const ROOT = path.join(process.cwd(), "content");

export function getPostSlugs(kind: ContentKind): string[] {
  return fs
    .readdirSync(path.join(ROOT, kind))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(kind: ContentKind, slug: string): PostMeta {
  const raw = fs.readFileSync(path.join(ROOT, kind, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const words = countWords(content);
  const str = (v: unknown, name: string): string => {
    if (typeof v !== "string" || !v) throw new Error(`content/${kind}/${slug}.mdx is missing front matter "${name}"`);
    return v;
  };
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : str(data.date, "date");
  const updatedRaw = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : (data.updated as string | undefined);
  return {
    kind,
    slug,
    title: str(data.title, "title"),
    description: str(data.description, "description"),
    date,
    updated: updatedRaw ?? date,
    order: typeof data.order === "number" ? data.order : 100,
    words,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    related: Array.isArray(data.related) ? (data.related as string[]) : [],
  };
}

export function getAllPosts(kind: ContentKind): PostMeta[] {
  return getPostSlugs(kind)
    .map((s) => getPost(kind, s))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function postPath(kind: ContentKind, slug: string): string {
  return `/${kind}/${slug}/`;
}
