import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    // pdfjs-dist optionally requires "canvas" in Node; the tools only run in the browser.
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: { remarkPlugins: ["remark-frontmatter", "remark-gfm"] },
});

export default withMDX(nextConfig);
