import type { Metadata } from "next";
import { PostList } from "@/components/content/PostList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { staticPageMeta } from "@/config/seo";
import { getAllPosts } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.guides!);

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">PDF guides</h1>
      <p className="mt-3 max-w-prose text-lg leading-8 text-ink-soft">
        Step-by-step walkthroughs for each tool, written around real tasks such as scanned forms, receipts and assembling documents.
      </p>
      <div className="mt-8">
        <PostList posts={getAllPosts("guides")} />
      </div>
    </div>
  );
}
