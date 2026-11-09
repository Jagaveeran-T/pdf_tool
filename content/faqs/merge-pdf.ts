import type { FaqItem } from "@/components/content/types";

export const faqs: FaqItem[] = [
  {
    q: "In what order will my PDFs be combined?",
    a: "The merged document follows the list on screen from top to bottom. The first card supplies the opening pages, the second follows, and so on. Pages inside each file keep their original order. Drag the cards, or use the move buttons, to change the sequence before you merge.",
  },
  {
    q: "How many files can I merge at once?",
    a: "Between 2 and 20 PDFs per run. Each file can be up to 50 MB and the total up to 200 MB. If your set is larger, merge it in stages and then join the intermediate results.",
  },
  {
    q: "Why was my PDF rejected as password-protected?",
    a: "Encrypted files cannot be combined by this tool, and it does not remove passwords. If you have the password and the right to do so, open the file in a PDF viewer, save an unprotected copy, add that copy to the list and try again.",
  },
  {
    q: "Will bookmarks and form fields survive the merge?",
    a: "Not reliably. Bookmarks, outlines, interactive form fields, accessibility tags and some metadata may not be carried into the merged file. The visible pages look the same. If you rely on those features, check the result or keep the originals.",
  },
  {
    q: "Does merging change my original files?",
    a: "No. The tool reads your files and builds a new PDF, so the originals on your device stay exactly as they were. You can try different orders and download more than one version.",
  },
  {
    q: "Can I merge PDFs with different page sizes?",
    a: "Yes. Pages are copied as they are, so an A4 file and a US Letter file can sit in the same document, each page keeping its own size. Printers and viewers may scale pages differently, so check the print preview if the pack is going to paper.",
  },
  {
    q: "Why does the merge take a while on my phone?",
    a: "The pages are processed in your browser using your own device's memory and processor. Large or numerous files take longer, and very big sets can fail on phones, in which case a clear message is shown. Try fewer files at a time or use a computer.",
  },
  {
    q: "Are my documents uploaded when I merge them?",
    a: "No. Merging runs locally in your browser and the files are not sent to our servers. The page may show ads and may use optional analytics if you allow them, but the content of your documents is not part of that. Closing the tab removes the files from the page.",
  },
];
