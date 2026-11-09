import type { ToolContent } from "@/components/content/types";

export const toolContent: ToolContent = {
  intro:
    "Combine two or more PDF files into a single document, in the order you choose, without creating an account. Everything happens inside your browser, so the files you pick are read on your own device rather than sent to our servers. It suits anyone who has a pile of separate PDFs, such as a cover letter, a CV and a certificate, and needs to send or print them as one file.",
  sections: [
    {
      id: "what-it-does",
      heading: "What this merge tool actually does",
      paragraphs: [
        "You add between 2 and 20 PDF files, arrange them in the sequence you want, and the tool produces one new PDF named merged.pdf. Each source file contributes all of its pages, one after another, so a 3-page file followed by a 5-page file gives you an 8-page result. Nothing is rewritten or redrawn: the pages are copied across as they are, which means fonts, embedded images and layout stay exactly as they were in the originals.",
        "Once a file is added, the tool tries to show a small thumbnail of its first page together with its page count. That preview is a quick sanity check. If the thumbnail shows an invoice when you expected a transcript, you have picked the wrong file, and you can remove it before anything is combined. If a file cannot be previewed, it may still merge fine, but treat that as a hint to open it separately and make sure it is not damaged.",
        "Ordering is done on the list itself. You can drag a file to a new position, or use the Move up and Move down buttons, which are easier on a touch screen or when the list is long. A rotate control turns a whole file by 90 degrees at a time, and the rotation applies to every page in that file. That is handy when one scanned document came out sideways, but it is not a per-page tool.",
      ],
    },
    {
      id: "common-uses",
      heading: "Situations where merging saves time",
      paragraphs: [
        "Application forms are the classic case. A university portal or a visa office often allows a single upload, yet your documents live in separate files: the filled form, a passport scan, a bank statement and a letter. Merging them into one PDF in the right order means the reviewer sees everything in a sensible sequence, and you only have to name and track one attachment.",
        "Freelancers and small businesses use it for invoice bundles and contracts. A signed agreement, its annex and a statement of work can travel as one file, which reduces the chance that someone receives the contract but never sees the annex. Students use it to turn lecture handouts into a single revision pack, or to stitch together a report that was written in separate chapters by different group members.",
      ],
      bullets: [
        "Job applications: cover letter, CV and certificates in one upload.",
        "Expense claims: several receipts exported as PDFs, combined into one claim file.",
        "Study material: weekly slides collected into a single revision document.",
        "Group projects: chapters written separately, joined into a final submission.",
      ],
    },
    {
      id: "what-carries-over",
      heading: "What carries over and what may not",
      paragraphs: [
        "The visible content of every page is preserved: text, vector graphics, photos and fonts that were embedded in the source file. Because the pages are copied rather than converted, the output does not go through a lossy step, and the file size of the result is roughly the combined size of the inputs plus a small amount of overhead. This site does not compress, so merging ten 4 MB files will give you something close to 40 MB.",
        "Parts of a PDF that are not page content are less reliable. Bookmarks and outlines, interactive form fields, some link and comment annotations, and document-level details such as the title or author in the metadata may not survive the merge. If your documents rely on a clickable table of contents or fillable fields, check the result carefully, and consider filling in forms and flattening them before you merge.",
        "The tool uses the pdf-lib library to do the copying. It handles ordinary PDFs from word processors, scanners, phone apps and print-to-PDF drivers well. Unusual files produced by specialised software can occasionally trip it up, in which case you will see an error message rather than a silently broken file.",
      ],
    },
    {
      id: "privacy",
      heading: "How your files are handled",
      paragraphs: [
        "Merging runs in a background worker inside your browser tab. The PDFs you choose are read from your device into memory, combined there, and offered back to you as a download. The code that processes them does not send file data over the network, and you can confirm that by watching the Network tab in your browser's developer tools while you merge.",
        "The finished file exists only in memory and as a temporary download link, which is released shortly after the download starts. If you close or refresh the tab, everything is discarded. Separately from the tool, the site is hosted on Cloudflare, which may log standard request details such as an IP address, and optional analytics or advertising services may run only after you consent. Our privacy policy describes these in more detail.",
      ],
    },
  ],
  howTo: {
    name: "How to merge PDF files into one",
    description:
      "Add your PDFs, put them in the right order, optionally rotate any that are sideways, then download a single merged.pdf.",
    totalTime: "PT2M",
    steps: [
      {
        title: "Add your PDF files",
        text: "Drop your files onto the upload area or use the file picker. You need at least 2 and can add up to 20, with each file at most 50 MB and the total at most 200 MB.",
      },
      {
        title: "Check the thumbnails and page counts",
        text: "Look at each first-page preview and page count to confirm you picked the right documents. Remove anything that does not belong.",
      },
      {
        title: "Put the files in order",
        text: "Drag files into position, or select one and use Move up and Move down. The top of the list becomes the first pages of the result.",
      },
      {
        title: "Rotate sideways files",
        text: "If a scanned document is turned the wrong way, rotate that file in 90-degree steps. The rotation applies to all of its pages.",
      },
      {
        title: "Merge and download",
        text: "Press the merge button and wait for processing to finish. Then download merged.pdf and open it to scroll through the pages before you send it anywhere.",
      },
    ],
  },
  tips: [
    {
      title: "Name files so they sort themselves",
      text: "Prefix your files with 01, 02, 03 before you add them. If you select several at once, they often arrive in a predictable order and need less dragging.",
    },
    {
      title: "Scroll the whole result once",
      text: "A thirty-second skim of merged.pdf catches a duplicated file, a missing attachment or a page that came out upside down before the recipient does.",
    },
    {
      title: "Flatten forms before combining",
      text: "Form fields may not carry over. Fill the form in, then save or print it to a fresh PDF so the answers become ordinary page content, and merge that version.",
    },
    {
      title: "Watch the size of the total",
      text: "Output size is roughly the sum of the inputs. If an email limit is tight, shrink the source files first, for example by exporting at a lower resolution from the original app.",
    },
    {
      title: "Fix orientation per file, not per page",
      text: "Rotation applies to a whole file. If only one page in a scan is sideways, the cleanest fix is to rescan or export that page separately before merging.",
    },
    {
      title: "Keep the originals",
      text: "Merging creates a new file and leaves your sources untouched, but keep them anyway. If you later need a different order, it is quicker to merge again than to pick the result apart.",
    },
    {
      title: "Unlock protected files first",
      text: "This tool rejects password-protected PDFs and cannot remove passwords. If you own the document, open it in your usual viewer, save an unprotected copy where you are permitted to, and add that copy instead.",
    },
    {
      title: "Try fewer files on a phone",
      text: "Phones have less memory than computers. If a big batch fails, merge in two smaller rounds and then merge the two results together.",
    },
  ],
  limitations: [
    "You can merge between 2 and 20 PDF files in one job, and each file may be at most 50 MB with a combined total of no more than 200 MB.",
    "Password-protected (encrypted) PDFs are not supported and are rejected with a message; this site does not remove or bypass passwords.",
    "Damaged or corrupt PDFs cannot be read and will be rejected, so a file that fails here may also fail to open in other programs.",
    "Bookmarks, outlines, form fields, some interactive annotations and document metadata may not carry over into the merged file.",
    "The tool does not compress, so the merged file will be about as large as all the inputs added together.",
    "Rotation is applied to a whole file at a time, and you cannot reorder or delete individual pages inside one source PDF in this tool.",
    "Large batches can run out of memory, especially on phones and older devices; if that happens, merge fewer files at a time or try a desktop browser.",
  ],
};
