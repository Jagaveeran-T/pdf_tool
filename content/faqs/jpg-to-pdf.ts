import type { FaqItem } from "@/components/content/types";

export const faqs: FaqItem[] = [
  {
    q: "Does converting a JPG to PDF reduce the picture quality?",
    a: "Upright JPEG photos are placed in the PDF byte for byte, so they are not compressed a second time. The exception is a photo that carries an EXIF rotation flag, or one you rotated yourself. Those are redrawn upright and saved again as JPEG at quality 0.92, which is slightly lossy but usually hard to see.",
  },
  {
    q: "Why does this tool only accept JPEG files?",
    a: "It is built around JPEG photos and scans, and it checks the file signature as well as the extension. For PNG, WebP or a mix of formats use the Image to PDF tool on this site, which also offers more layout options.",
  },
  {
    q: "What does Fit to image page size do?",
    a: "Every page takes the exact dimensions of its own photograph, so there are no white bars. It is the default here and suits screen viewing. Choose A4 or US Letter if you want standard paper.",
  },
  {
    q: "Why did my photo appear sideways in another PDF tool?",
    a: "Phones often store pictures unrotated and add an EXIF flag saying which way is up. Software that ignores the flag shows the picture sideways. Here, photos carrying that flag are redrawn upright before they go into the PDF.",
  },
  {
    q: "Can I photograph a paper document and turn it into a PDF?",
    a: "Yes. Photograph each page flat, in even light and from directly above, then add the pictures in page order. The result is an image-based PDF, so the text cannot be selected or searched. This tool does not perform text recognition.",
  },
  {
    q: "How many photos can I convert at once?",
    a: "Up to 50 JPEG photos per run, each up to 50 MB, with a combined size of up to 200 MB. Smaller batches are safer on phones with limited memory, and the tool shows a warning when a batch is large.",
  },
  {
    q: "Why is the PDF almost as large as my photos?",
    a: "Because upright JPEG data is embedded without recompression, the PDF carries about as much image data as the files you added. This tool does not shrink pictures. For a smaller PDF, start from lower-resolution photos or split the set into several PDFs.",
  },
  {
    q: "Are my photos sent to a server?",
    a: "No. The conversion happens in your browser and the photos are not sent to our servers. That matters for pictures of forms, identity documents or private moments. The site may show ads and may use optional analytics if you allow them, but your image files are not part of that.",
  },
];
