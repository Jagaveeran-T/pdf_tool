import type { FaqItem } from "@/components/content/types";

export const faqs: FaqItem[] = [
  {
    q: "How do I write the page ranges?",
    a: "Separate items with commas and use a hyphen for a run of pages. For example, 1-3, 5, 8-10 selects pages 1, 2, 3, 5, 8, 9 and 10. Numbers refer to the position of the page in the file, counting from the first page, not to numbers printed on the paper.",
  },
  {
    q: "What is the difference between the three split modes?",
    a: "Extract pages puts everything you list into one new PDF. Separate files per range turns each comma-separated range into its own PDF. Every page as its own PDF creates one file per page. When more than one file is created they arrive together in a ZIP.",
  },
  {
    q: "Is there a limit on the size of the PDF I can split?",
    a: "Yes. The file can be up to 50 MB and 500 pages, and a single run can create up to 500 output files. If a device runs short of memory the tool shows an error instead of crashing, which is more likely on a phone. Try a computer or a smaller file in that case.",
  },
  {
    q: "Can I split a password-protected PDF?",
    a: "No. Encrypted files are rejected with a message, and this tool does not remove passwords. If you have the password and the right to do so, open the file in a PDF viewer, save an unprotected copy and load that copy here.",
  },
  {
    q: "Will form fields and bookmarks be kept in the new files?",
    a: "They may not be. Bookmarks, outlines, interactive form fields, accessibility tags and some metadata might not carry over. The visible content of each page is preserved. Keep your original if you still need the live form or the navigation.",
  },
  {
    q: "Can I reorder pages while extracting them?",
    a: "In Extract mode the pages appear in the order you type them, so 5, 1-2 puts page 5 first. That is a simple way to reorder a few pages. It is not a full page organiser, and the tool cannot rotate or delete pages inside a file.",
  },
  {
    q: "What happens if I type a page that does not exist?",
    a: "The tool checks the ranges against the real page count and shows a message instead of creating a file. Fix the range and try again. Nothing is changed in the original PDF.",
  },
  {
    q: "Is my document uploaded while it is being split?",
    a: "No. Splitting happens in your browser and the file is not sent to our servers. The site may show ads and may use optional analytics if you allow them, but your document content is not part of that. Closing the tab clears the file from the page.",
  },
];
