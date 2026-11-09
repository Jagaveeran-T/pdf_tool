import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/content/ToolPageLayout";
import { JpgToPdfTool } from "@/components/tools/JpgToPdfTool";
import { TOOLS } from "@/config/tools";
import { faqs } from "@/content/faqs/jpg-to-pdf";
import { toolContent } from "@/features/jpg-to-pdf/components/toolContent";
import { buildMetadata } from "@/lib/seo";

const tool = TOOLS["jpg-to-pdf"];

export const metadata: Metadata = buildMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
  image: "/og/jpg-to-pdf.png",
});

export default function Page() {
  return (
    <ToolPageLayout toolId="jpg-to-pdf" title="JPG to PDF" content={toolContent} faqs={faqs}>
      <JpgToPdfTool />
    </ToolPageLayout>
  );
}
