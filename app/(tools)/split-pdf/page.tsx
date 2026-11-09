import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/content/ToolPageLayout";
import { SplitPdfTool } from "@/components/tools/SplitPdfTool";
import { TOOLS } from "@/config/tools";
import { faqs } from "@/content/faqs/split-pdf";
import { toolContent } from "@/features/split-pdf/components/toolContent";
import { buildMetadata } from "@/lib/seo";

const tool = TOOLS["split-pdf"];

export const metadata: Metadata = buildMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
  image: "/og/split-pdf.png",
});

export default function Page() {
  return (
    <ToolPageLayout toolId="split-pdf" title="Split PDF" content={toolContent} faqs={faqs}>
      <SplitPdfTool />
    </ToolPageLayout>
  );
}
