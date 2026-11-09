import { notFound } from "next/navigation";
import { ArticleLayout } from "./ArticleLayout";
import { getAllPosts, getPost, getPostSlugs, type ContentKind, type PostMeta } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";
import { postPath } from "@/lib/mdx";

export const staticSlugs = (kind: ContentKind) => getPostSlugs(kind).map((slug) => ({ slug }));

export function postMetadata(kind: ContentKind, slug: string) {
  const post = getPost(kind, slug);
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: postPath(kind, slug),
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated,
  });
}

function relatedFor(post: PostMeta): PostMeta[] {
  const all = [...getAllPosts("blog"), ...getAllPosts("guides")].filter((p) => !(p.kind === post.kind && p.slug === post.slug));
  const explicit = post.related
    .map((r) => all.find((p) => r === p.slug || r === `${p.kind}/${p.slug}`))
    .filter((p): p is PostMeta => Boolean(p));
  const fallback = all.filter((p) => p.kind === post.kind && !explicit.includes(p));
  return [...explicit, ...fallback].slice(0, 3);
}

export async function PostRoute({ kind, slug }: { kind: ContentKind; slug: string }) {
  if (!getPostSlugs(kind).includes(slug)) notFound();
  const post = getPost(kind, slug);
  const { default: Content } = await import(`@/content/${kind}/${slug}.mdx`);
  return (
    <ArticleLayout post={post} related={relatedFor(post)}>
      <Content />
    </ArticleLayout>
  );
}
