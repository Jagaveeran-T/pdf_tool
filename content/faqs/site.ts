import type { FaqItem } from "@/components/content/types";

export const siteFaqs: FaqItem[] = [
  {
    q: "Are my files uploaded to a server?",
    a: "No. The tools read your files in your browser, process them in your device's memory and hand the result back as a download. The files are not sent to our servers. Closing or refreshing the tab discards them. The page itself can load advertising and optional analytics scripts, but your file contents are not part of those requests.",
  },
  {
    q: "Do I need an account or to pay?",
    a: "No account, no signup and no payment. The site is free to use and is supported by advertising where ads are enabled.",
  },
  {
    q: "Which file types can I use?",
    a: "Image to PDF accepts JPG, PNG and WebP images. JPG to PDF accepts JPEG photos. Merge PDF and Split PDF accept ordinary PDF files. The tools check the first bytes of each file, so a renamed file of the wrong type is rejected with a message.",
  },
  {
    q: "What are the size limits?",
    a: "Image tools take up to 50 files of up to 50 MB each, 200 MB in total. Merge PDF takes 2 to 20 files with the same size caps. Split PDF takes one PDF of up to 50 MB and 500 pages. Phones and older computers may cope with less because everything runs in local memory.",
  },
  {
    q: "Can you compress a PDF, run OCR or remove a password?",
    a: "Partly. The Compress PDF tool can shrink the JPEG images inside a PDF, or flatten pages into pictures to aim for a size, but it cannot promise a result and flattening removes selectable text. The site does not offer text recognition (OCR), password removal, editing or signing. The other tools convert images, merge PDFs and split PDFs.",
  },
  {
    q: "Why was my PDF rejected as encrypted?",
    a: "Password-protected or encrypted PDFs cannot be read by the merge and split tools. If you own the document and know the password, open it in a PDF viewer and save an unprotected copy, then try again. The guide on fixing common PDF errors walks through this.",
  },
  {
    q: "Why does my photo come out the right way up?",
    a: "Phones often save photos unrotated with an EXIF flag that says which way is up. The tools read that flag and redraw such photos upright before adding them to the PDF. You can also rotate any image yourself before converting.",
  },
  {
    q: "Does the site work on a phone?",
    a: "Yes. The layout adapts to small screens and the file picker opens your photo library or file manager. Large batches can run out of memory on a phone, in which case you see a message and can try fewer files at a time.",
  },
  {
    q: "What do you store about me?",
    a: "Only your cookie choice, saved in your browser. If you allow analytics, anonymous usage counts are sent to Google Analytics, and if you allow advertising, Google AdSense may set cookies. Details are in the Privacy Policy and Cookie Policy.",
  },
  {
    q: "How do I report a bug or a wrong result?",
    a: "Use the contact page or email the address shown there. Tell us the tool, your browser and device, and what happened. Please do not send confidential documents, because we do not need them to investigate.",
  },
];
