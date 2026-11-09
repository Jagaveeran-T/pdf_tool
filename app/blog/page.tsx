import type { Metadata } from "next";
import { PostList } from "@/components/content/PostList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { staticPageMeta } from "@/config/seo";
import { getAllPosts } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.blog!);

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">PDF blog</h1>
      <p className="mt-3 max-w-prose text-lg leading-8 text-ink-soft">
        Plain-language explainers about image formats, page sizes, scanning, file size and staying safe with online PDF tools.
      </p>
      <div className="mt-8">
        <PostList posts={getAllPosts("blog")} />
      </div>
    </div>
  );
}
