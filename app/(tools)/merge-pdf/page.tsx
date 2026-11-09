import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/content/ToolPageLayout";
import { MergePdfTool } from "@/components/tools/MergePdfTool";
import { TOOLS } from "@/config/tools";
import { faqs } from "@/content/faqs/merge-pdf";
import { toolContent } from "@/features/merge-pdf/components/toolContent";
import { buildMetadata } from "@/lib/seo";

const tool = TOOLS["merge-pdf"];

export const metadata: Metadata = buildMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
  image: "/og/merge-pdf.png",
});

export default function Page() {
  return (
    <ToolPageLayout toolId="merge-pdf" title="Merge PDF" content={toolContent} faqs={faqs}>
      <MergePdfTool />
    </ToolPageLayout>
  );
}
