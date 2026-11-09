import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/content/ToolPageLayout";
import { CompressPdfTool } from "@/components/tools/CompressPdfTool";
import { TOOLS } from "@/config/tools";
import { faqs } from "@/content/faqs/compress-pdf";
import { toolContent } from "@/features/compress-pdf/components/toolContent";
import { buildMetadata } from "@/lib/seo";

const tool = TOOLS["compress-pdf"];

export const metadata: Metadata = buildMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
  image: "/og/compress-pdf.png",
});

export default function Page() {
  return (
    <ToolPageLayout toolId="compress-pdf" title="Compress PDF" content={toolContent} faqs={faqs}>
      <CompressPdfTool />
    </ToolPageLayout>
  );
}
