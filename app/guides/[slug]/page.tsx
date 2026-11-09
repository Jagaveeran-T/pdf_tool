import type { Metadata } from "next";
import { PostRoute, postMetadata, staticSlugs } from "@/components/content/PostRoute";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticSlugs("guides");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return postMetadata("guides", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostRoute kind="guides" slug={slug} />;
}
