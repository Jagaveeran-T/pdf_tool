import type { FaqItem } from "@/components/content/types";

export const faqs: FaqItem[] = [
  {
    q: "What is the difference between the two compression modes?",
    a: "\"Keep text selectable\" finds the JPEG pictures inside your PDF, scales them down and saves them at a lower quality, leaving text, links and drawings alone. \"Flatten pages to images\" draws each page as one picture and builds a new PDF from those pictures. Flatten works on any PDF and can aim for a size, but the result is no longer searchable or selectable text.",
  },
  {
    q: "Can it get my PDF under 100 KB, 200 KB or 500 KB?",
    a: "Sometimes. In flatten mode you can pick a target, and the tool tries up to four quality settings and keeps the best one that fits. A one-page scan often reaches 200 KB; a 30-page scan under 100 KB usually cannot stay readable. If even the smallest setting is too big, the tool tells you the size it reached instead of pretending.",
  },
  {
    q: "Why did it say it could not make my file smaller?",
    a: "That happens when there is little to shrink. PDFs made from text and vector graphics are already compact, and some scanners store pages in formats this tool does not recompress. When the result would be the same size or larger, the tool gives you your original file back, unchanged, with a short explanation.",
  },
  {
    q: "Will the text in my PDF still be searchable?",
    a: "In \"Keep text selectable\" mode, yes, because text is not touched. In flatten mode, no: every page becomes a picture, so you cannot select, copy or search the words, and links, bookmarks and form fields stop working. There is no text recognition (OCR) on this site that could bring the text back.",
  },
  {
    q: "Is my document uploaded anywhere?",
    a: "No. The PDF is read and processed inside your browser tab and the result is handed back as a download. You can confirm it by watching the Network tab in your browser's developer tools while you compress. The page itself, its scripts and any optional analytics or ads come from the web as usual, but your file does not.",
  },
  {
    q: "Is there a size or page limit?",
    a: "Files up to 50 MB and 300 pages work in \"Keep text selectable\" mode, and flatten mode handles up to 60 pages because it draws every page. Phones and older computers have less memory than desktops, so a large file can fail there; try a computer, close other tabs, or split the PDF first.",
  },
  {
    q: "Why is a password-protected PDF rejected?",
    a: "Encrypted PDFs cannot be opened by this tool, and it does not remove passwords. If you are allowed to, open the file in a PDF viewer, save an unprotected copy, and compress that copy.",
  },
  {
    q: "How much smaller will my file get?",
    a: "There is no honest single number. Photo-heavy scans can shrink a lot; a PDF with few or no JPEG images may not shrink at all in \"Keep text selectable\" mode. After each run the tool shows the before and after sizes so you can judge for yourself, and you should open the result and zoom in on small print before you send it.",
  },
];
