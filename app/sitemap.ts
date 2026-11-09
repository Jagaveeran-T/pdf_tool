import type { MetadataRoute } from "next";
import { staticPaths } from "@/config/navigation";
import { absoluteUrl } from "@/config/site";
import { getAllPosts, postPath } from "@/lib/mdx";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = [...getAllPosts("blog"), ...getAllPosts("guides")];
  return [
    ...staticPaths.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...posts.map((p) => ({ url: absoluteUrl(postPath(p.kind, p.slug)), lastModified: p.updated, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
