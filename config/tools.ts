export type ToolId = "image-to-pdf" | "jpg-to-pdf" | "merge-pdf" | "split-pdf" | "compress-pdf";

export interface ToolMeta {
  id: ToolId;
  name: string;
  /** Route with trailing slash. */
  path: string;
  /** One sentence for cards and navigation. */
  shortDescription: string;
  /** <title> text (the site name is NOT appended). */
  seoTitle: string;
  seoDescription: string;
  related: ToolId[];
  /** Route of the in-depth guide. */
  guide: string;
}

export const TOOLS: Record<ToolId, ToolMeta> = {
  "image-to-pdf": {
    id: "image-to-pdf",
    name: "Image to PDF",
    path: "/image-to-pdf/",
    shortDescription: "Combine JPG, PNG and WebP images into one PDF with page size, orientation and margin options.",
    seoTitle: "Image to PDF Converter: JPG, PNG and WebP to PDF Online",
    seoDescription:
      "Convert JPG, PNG and WebP images into one PDF in your browser. Choose A4, Letter or fit-to-image pages, reorder and rotate images, then download. Files stay on your device.",
    related: ["jpg-to-pdf", "compress-pdf", "merge-pdf"],
    guide: "/guides/image-to-pdf-guide/",
  },
  "jpg-to-pdf": {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    path: "/jpg-to-pdf/",
    shortDescription: "Turn phone photos and scans saved as JPG into a PDF, keeping the original JPEG data when possible.",
    seoTitle: "JPG to PDF: Convert JPEG Photos and Scans to PDF Free",
    seoDescription:
      "Convert JPG and JPEG photos or scans to PDF in your browser. Upright photos are embedded without re-compression, one per page. No upload, no signup.",
    related: ["image-to-pdf", "compress-pdf", "merge-pdf"],
    guide: "/guides/image-to-pdf-guide/",
  },
  "merge-pdf": {
    id: "merge-pdf",
    name: "Merge PDF",
    path: "/merge-pdf/",
    shortDescription: "Join two or more PDF files into one document and put them in the order you want.",
    seoTitle: "Merge PDF Files Online Free: Combine PDFs in Your Browser",
    seoDescription:
      "Combine PDF files into one document, reorder them by drag and drop and download the result. Processed locally in your browser, no signup needed.",
    related: ["split-pdf", "compress-pdf", "image-to-pdf"],
    guide: "/guides/merge-pdf-guide/",
  },
  "split-pdf": {
    id: "split-pdf",
    name: "Split PDF",
    path: "/split-pdf/",
    shortDescription: "Extract pages or ranges from a PDF, or split it into one file per range or per page.",
    seoTitle: "Split PDF: Extract Pages or Split a PDF into Separate Files",
    seoDescription:
      "Extract pages from a PDF, split it by page ranges or into single pages and download a PDF or ZIP. Everything runs in your browser.",
    related: ["merge-pdf", "compress-pdf", "image-to-pdf"],
    guide: "/guides/split-pdf-guide/",
  },
  "compress-pdf": {
    id: "compress-pdf",
    name: "Compress PDF",
    path: "/compress-pdf/",
    shortDescription: "Make a PDF smaller by shrinking its images, or flatten scanned pages to reach a size target.",
    seoTitle: "Compress PDF Online: Reduce PDF Size in Your Browser, No Upload",
    seoDescription:
      "Reduce PDF file size in your browser. Keep text selectable by shrinking embedded images, or flatten scans to aim for 100 KB, 200 KB or 500 KB. Files stay on your device.",
    related: ["merge-pdf", "split-pdf", "jpg-to-pdf"],
    guide: "/guides/compress-pdf-guide/",
  },
};

export const TOOL_LIST: ToolMeta[] = Object.values(TOOLS);
