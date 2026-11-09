import type { ToolContent } from "@/components/content/types";

export const toolContent: ToolContent = {
  intro:
    "Make a PDF smaller without installing anything and without sending it to a server. The tool offers two honest approaches: shrink the pictures inside the PDF while leaving the text alone, or flatten every page into an image so you can aim for a specific size such as 200 KB. Both run in your browser, and the page tells you plainly what each one costs you.",
  sections: [
    {
      id: "what-it-does",
      heading: "What this compressor actually does",
      paragraphs: [
        "A PDF is a container. Inside it there can be text, vector drawings, fonts and pictures, and for most real-world files that are too big, the pictures are the problem. A scanned form, a phone photo saved as PDF or a brochure full of photographs can easily reach tens of megabytes, while a 40-page contract made of pure text may be a few hundred kilobytes. This tool goes after the pictures, because that is where almost all of the savings are.",
        "You choose between two modes. Keep text selectable looks for JPEG images inside the file, scales each one down to a sensible maximum size and saves it again at a lower quality. Everything that is not one of those images stays exactly as it was. Flatten pages to images works differently: it draws each page onto a canvas, saves that as one JPEG and builds a new PDF from the pictures. It is blunter, but it works on any PDF, including ones whose images the first mode cannot touch.",
        "After every run you see the original size, the new size and the percentage saved. If the result would not be smaller, you get your original file back with an explanation instead of a larger file dressed up as a success.",
      ],
    },
    {
      id: "keep-text-mode",
      heading: "Keep text selectable: how it works and where it falls short",
      paragraphs: [
        "In this mode the tool walks through the objects inside the PDF and picks out images stored as plain JPEG data in an ordinary RGB or greyscale colour space. Each one is decoded by your browser, drawn at a smaller size if it is bigger than the level allows, and encoded again. The new image replaces the old one only if it is clearly smaller; otherwise the original image stays.",
        "Because nothing else is rewritten, text stays sharp and selectable, links keep working and vector artwork keeps its crisp edges. The three levels set how aggressive the image step is: Balanced keeps images up to 2000 pixels on the long side at fairly high quality, Smaller goes to 1500 pixels, and Smallest to 1000 pixels at clearly lower quality.",
        "The honest limit is coverage. Images stored in other ways are skipped on purpose: pictures with transparency masks, CMYK photos from print workflows, black-and-white fax-style scans, and images saved with lossless compression instead of JPEG. If your PDF is made of those, this mode may report that it found nothing to shrink. That is not a failure of your file, it is a boundary of the method, and the flatten mode is the fallback for scans.",
      ],
      bullets: [
        "Good fit: PDFs exported from phone scanning apps, slide decks with photos, brochures and reports with embedded JPEG pictures.",
        "Poor fit: text-only documents, vector-only drawings, and scans stored as black-and-white fax images.",
        "Safe by design: if anything about an image looks unusual, it is left untouched rather than risked.",
      ],
    },
    {
      id: "flatten-mode",
      heading: "Flatten pages to images: when you need a size target",
      paragraphs: [
        "Government portals, job applications and bank forms often set a hard upload limit such as 100 KB, 200 KB or 500 KB. For those cases, flatten mode lets you pick a target. The tool renders the pages at a series of resolution and quality settings, from sharp to small, and uses a binary search so that it needs at most four attempts rather than trying every setting. It keeps the best-looking result that fits under your limit.",
        "This power comes at a price you should know before you click. Every page becomes a picture, so you cannot select, copy or search the text, and links, bookmarks and form fields no longer work. Screen readers cannot read the document either, which matters if accessibility is a requirement for your submission. The tool shows a warning on screen when you choose this mode so the trade-off is never hidden.",
        "An optional greyscale setting converts the pages to black and white tones before saving, which typically helps with scans of text documents that were captured in colour. It is not useful for photographs or documents where colour carries meaning, such as colour-coded charts.",
        "A target is an aim, not a guarantee. A single page can usually be brought down to 200 KB and stay readable. A thirty-page scanned report cannot be squeezed under 100 KB without becoming unreadable, and when the smallest setting still misses your target the tool says so and tells you the size it reached.",
      ],
    },
    {
      id: "privacy",
      heading: "How your file is handled",
      paragraphs: [
        "The PDF is read from your device into your browser's memory. Keep text mode runs in a background worker inside the tab, and flatten mode runs in the page itself with the pdf.js library parsing in its own worker. In both cases the code that processes the file does not send it over the network, and you can verify this with the Network tab of your browser's developer tools.",
        "The result exists only in memory and as a temporary download link that is released shortly after the download starts. Closing or refreshing the tab discards everything. Separately, the site is hosted on Cloudflare, which may log standard request details such as an IP address, and optional analytics or advertising may run only after you give consent. Our privacy policy describes this in full.",
      ],
    },
    {
      id: "choosing",
      heading: "Which mode should you choose?",
      paragraphs: [
        "Start with Keep text selectable at the Balanced level. It is the gentlest option, it preserves the document's structure, and it costs you nothing if it cannot help, because you simply receive your original file. If the saving is too small, try Smaller. If the document is a scan and the first mode found no images to shrink, or you must hit a specific size, switch to Flatten pages and choose a target.",
        "Whatever you pick, open the result and zoom in on the smallest print, signatures, stamps and numbers. Compression is lossy, which means detail is thrown away, and only you can judge whether the remaining detail is enough for the person who will read the document. Always keep your original file.",
      ],
    },
  ],
  howTo: {
    name: "How to compress a PDF in your browser",
    description:
      "Add one PDF, choose between keeping text selectable or flattening pages, pick a quality level or size target, then download the smaller file.",
    totalTime: "PT2M",
    steps: [
      {
        title: "Add your PDF",
        text: "Drop one PDF onto the upload area or choose it with the file picker. Files up to 50 MB work, and the tool shows a thumbnail and the page count so you can confirm it is the right file.",
      },
      {
        title: "Choose how to compress",
        text: "Pick Keep text selectable to shrink the pictures inside the PDF, or Flatten pages to images if the file is a scan or you need to hit a target size.",
      },
      {
        title: "Pick a level or a target",
        text: "Choose Balanced, Smaller or Smallest. In flatten mode you can also choose a size target such as under 200 KB, and turn on greyscale for black-and-white documents.",
      },
      {
        title: "Press Compress PDF",
        text: "A progress bar shows the work. You can cancel at any time. Larger files take longer, especially on phones.",
      },
      {
        title: "Check and download",
        text: "Read the before and after sizes, download the file, then open it and zoom in on small print. If it is not good enough, go back and choose a gentler level.",
      },
    ],
  },
  tips: [
    {
      title: "Try the gentle option first",
      text: "Balanced in Keep text mode costs almost nothing in quality and keeps your document searchable. Only move to flatten mode if you need to.",
    },
    {
      title: "Fix the problem at the source when you can",
      text: "If you are scanning, a lower scan resolution such as 150 to 200 dpi and a grayscale setting often produce a small file from the start, and no compressor can match that.",
    },
    {
      title: "Split before you flatten a long file",
      text: "Flatten mode handles up to 60 pages. For a longer document, split it into parts with the Split PDF tool, compress each part and, if needed, join them again with Merge PDF.",
    },
    {
      title: "Check the numbers",
      text: "After compressing a form or invoice, zoom in on amounts, dates and reference numbers. Blurry digits are the most common reason a compressed document gets rejected.",
    },
    {
      title: "Keep the original",
      text: "Compression discards detail permanently. Always keep your original file, and give the compressed one a different name so the two never get mixed up.",
    },
  ],
  limitations: [
    "Keep text mode only shrinks plain JPEG images. PDFs with no such images, such as text-only files, will not get smaller, and you will receive your original file back.",
    "Flatten mode removes selectable text, links, bookmarks and form fields, and it cannot restore them afterwards. There is no text recognition (OCR) on this site.",
    "Size targets are best-effort. If the smallest setting still misses your target, the tool reports the size it reached.",
    "Password-protected or encrypted PDFs are rejected. This tool does not remove passwords.",
    "Limits: 50 MB per file, 300 pages in Keep text mode and 60 pages in Flatten mode. Phones and older computers have less memory and may fail on large files.",
    "Compression is lossy and permanent for the file you download. Colour accuracy, fine print and thin lines can change, so review the result before you send it.",
  ],
};
