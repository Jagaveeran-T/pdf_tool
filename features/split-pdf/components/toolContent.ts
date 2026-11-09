import type { ToolContent } from "@/components/content/types";

export const toolContent: ToolContent = {
  intro:
    "Pull the pages you need out of a PDF, or break one document into several smaller ones, using simple page numbers. You choose between extracting a selection into one file, cutting out separate files by range, or saving every page on its own. The work is done in your browser, so your document stays on your device while it is processed.",
  sections: [
    {
      id: "what-it-does",
      heading: "Three ways to take a PDF apart",
      paragraphs: [
        "Split works on one PDF at a time. After you add a file, the tool shows its page count and a preview of the first page, then offers three modes. Extract pages gives you a single new PDF that contains only the pages you list. Separate files per range turns each range you type into its own PDF. Every page as its own PDF saves each page individually.",
        "Page numbers are 1-based, meaning the first page of the document is page 1, whatever number is printed on the page itself. You write them as single pages and from-to ranges separated by commas, for example 1-3, 5, 8-10. Spaces are ignored, so you do not need to format anything carefully. Four presets cover frequent requests: First page, Last page, Odd pages and Even pages.",
        "When a job produces more than one file, they arrive together in a single ZIP so you do not face a stack of separate downloads. A single extracted selection downloads directly as extracted.pdf. Multi-file results come as split-pages.zip, containing names such as range-1.pdf or page-1.pdf, which you can rename once you have unpacked them.",
      ],
    },
    {
      id: "choosing-a-mode",
      heading: "Which mode fits which job",
      paragraphs: [
        "Use Extract pages when you want one tidy file out of a larger one. Say you have a 60-page report and your manager only needs the summary on pages 2-4 plus the appendix table on page 57. Typing 2-4, 57 gives you one 4-page PDF. The pages come out in the order you list them, so typing 3, 1, 2 produces a file that starts with the original third page, which is a quick way to rearrange a short document.",
        "Use Separate files per range when the source is really several documents glued together. A scanned bundle containing a contract on pages 1-6, an invoice on pages 7-8 and an ID copy on page 9 can be cut with 1-6, 7-8, 9, producing three PDFs in one ZIP. Use Every page when each page is a standalone item, such as one-page certificates or tickets exported together, and you want to send each to a different person.",
      ],
      bullets: [
        "Odd pages and Even pages are useful when a double-sided document was scanned as two passes.",
        "Last page is a quick way to grab a signature page or a final summary.",
        "Ranges can be arranged in any order, and a page can appear in more than one range.",
      ],
    },
    {
      id: "what-carries-over",
      heading: "What the output looks like",
      paragraphs: [
        "Each page is copied across with its text, graphics, fonts and images intact, so the pieces look like the original. Because pages are copied rather than redrawn, you should not expect the layout to shift. The output is not compressed, so a file with a few large scanned pages will produce pieces that are still large, and the pieces add up to roughly the size of the original.",
        "As with any tool that rebuilds a document from selected pages, items that belong to the whole file rather than a single page may not come along. Bookmarks and outlines, form fields, some interactive annotations and document-level metadata are the usual casualties, and links that point to pages you did not keep will not lead anywhere useful. Check the result if your document depends on those features.",
      ],
    },
    {
      id: "privacy",
      heading: "Where your document goes",
      paragraphs: [
        "Your PDF is opened and processed by code running in your own browser, in a background worker. The file is not uploaded to our servers, and the processing code does not make network requests that carry file data. If you want proof, open your browser's developer tools, switch to the Network tab and run a split; you will see the page load and nothing that contains your document.",
        "Results are built in memory and offered as a download, and the temporary link is released a short while later. Refreshing or closing the tab clears everything. This matters for paperwork such as payslips, medical letters or contracts, where you want to share one page without circulating the rest. Our privacy policy lists the other things that may happen on the site, such as consented analytics or advertising.",
      ],
    },
  ],
  howTo: {
    name: "How to split a PDF or extract pages",
    description:
      "Add one PDF, choose a split mode, enter the pages or ranges you want, then download the extracted PDF or a ZIP of separate files.",
    totalTime: "PT2M",
    steps: [
      {
        title: "Add your PDF",
        text: "Choose one PDF of up to 50 MB. The tool reads it and shows the total page count and a first-page preview so you know you have the right file.",
      },
      {
        title: "Pick a mode",
        text: "Select Extract pages for one combined result, Separate files per range for several outputs, or Every page as its own PDF to split completely.",
      },
      {
        title: "Enter pages or ranges",
        text: "Type numbers like 1-3, 5, 8-10, or press a preset such as Odd pages. Check that no number is larger than the page count shown.",
      },
      {
        title: "Run the split",
        text: "Press the button and wait while the pages are copied. Larger documents take longer, and up to 500 pages are processed.",
      },
      {
        title: "Download and check",
        text: "Save extracted.pdf or split-pages.zip, open the result, and confirm each piece starts and ends on the pages you intended.",
      },
    ],
  },
  tips: [
    {
      title: "Count from the viewer, not the printed number",
      text: "A report may print page 1 on the third sheet because of a cover and contents. Use the page position in your PDF viewer, since that is what this tool counts.",
    },
    {
      title: "Reorder short documents by listing pages",
      text: "In Extract mode the pages follow the order you type. To move the last page to the front of a 4-page file, enter 4, 1, 2, 3.",
    },
    {
      title: "Cut a bundle with consecutive ranges",
      text: "Write ranges that touch but do not overlap, such as 1-6, 7-8, 9, and every page ends up in exactly one output file.",
    },
    {
      title: "Use presets for double-sided scans",
      text: "If front sides and back sides were scanned as two batches, Odd pages and Even pages pull each set out so you can handle them separately.",
    },
    {
      title: "Rename the ZIP contents",
      text: "Names like range-2.pdf are generic. Rename the unzipped files with a date or a recipient before you send them so nothing gets mixed up.",
    },
    {
      title: "Redaction needs more than splitting",
      text: "Leaving out pages removes them from the new file, but it does not edit a page that remains. If a kept page contains something private, remove it at the source before you share.",
    },
    {
      title: "Break very long files in stages",
      text: "Only up to 500 pages are processed. For a bigger document, extract the first section, then work on the remainder from a separate copy.",
    },
    {
      title: "Split before you combine",
      text: "If you need pages from several documents in one file, extract what you need from each, then bring the pieces together with the merge tool.",
    },
  ],
  limitations: [
    "Only one PDF can be processed at a time, with a maximum size of 50 MB and up to 500 pages processed.",
    "Password-protected (encrypted) PDFs are not supported and will be rejected, and this site cannot remove passwords.",
    "Corrupt or unreadable PDFs are rejected with a message instead of producing a partial result.",
    "Bookmarks, form fields, some interactive annotations and document-level metadata may not be carried into the output files.",
    "Page selection accepts single pages and from-to ranges separated by commas, with numbers counted from 1; other notations are not understood.",
    "The tool does not compress or edit content, so extracted pieces keep their original page quality and size, and you cannot change what is written on a page.",
    "Large or image-heavy documents can run out of memory on phones and older computers, in which case a desktop browser or a smaller selection is the better choice.",
  ],
};
