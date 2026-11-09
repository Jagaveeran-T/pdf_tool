import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/content/ToolPageLayout";
import { ImageToPdfTool } from "@/components/tools/ImageToPdfTool";
import { TOOLS } from "@/config/tools";
import { faqs } from "@/content/faqs/image-to-pdf";
import { toolContent } from "@/features/image-to-pdf/components/toolContent";
import { buildMetadata } from "@/lib/seo";

const tool = TOOLS["image-to-pdf"];

export const metadata: Metadata = buildMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: tool.path,
  image: "/og/image-to-pdf.png",
});

export default function Page() {
  return (
    <ToolPageLayout toolId="image-to-pdf" title="Image to PDF" content={toolContent} faqs={faqs}>
      <ImageToPdfTool />
    </ToolPageLayout>
  );
}
