import type { FaqItem } from "@/components/content/types";

export const faqs: FaqItem[] = [
  {
    q: "Can I combine JPG, PNG and WebP images in the same PDF?",
    a: "Yes. Add all three formats to one list and they are converted together into a single PDF. Each picture becomes its own page in the order shown on screen. You can reorder, rotate or remove pictures before you convert.",
  },
  {
    q: "What does Fit to image mean for the page size?",
    a: "Fit to image gives every page the same size as its own picture, so a wide image gets a wide page and a tall one a tall page, with no white padding. A4 and US Letter instead place every picture on a standard sheet, scaled to fit and centred.",
  },
  {
    q: "Will my images be cropped to fill the page?",
    a: "No. Each image is scaled to fit inside the page and centred, so the whole picture stays visible. If the shape of the image differs from the shape of the page you will see white space at the sides or at the top and bottom instead of lost content.",
  },
  {
    q: "What happens to transparent PNG files?",
    a: "Transparency is kept and the see-through areas show the white page behind them. If you want a different background colour, add it to the picture in an image editor before converting.",
  },
  {
    q: "Why can the PDF be bigger than my WebP files?",
    a: "Your browser decodes each WebP file and the tool stores the pixels in the PDF as PNG. PNG is lossless and usually stores photographs less compactly than WebP, so the result can be larger than the originals. This tool does not compress images.",
  },
  {
    q: "What is the difference between automatic, portrait and landscape orientation?",
    a: "Automatic picks a landscape page for wide images and a portrait page for tall ones. Portrait and landscape force every page into the same shape. Orientation only matters with A4 or US Letter, because Fit to image already follows each picture.",
  },
  {
    q: "How many images can I add, and how large can they be?",
    a: "Up to 50 images per run, each up to 50 MB, with a combined size of up to 200 MB. If you go over a limit the tool tells you. Splitting the pictures into two groups and creating two PDFs is the simplest workaround. Phones with little memory may manage fewer.",
  },
  {
    q: "Are my pictures uploaded anywhere when I convert them?",
    a: "No. The conversion runs in your browser and the files are not sent to our servers. The page may show advertising and may use optional analytics if you allow them, but the content of your images is not part of that. Closing the tab clears the files from the page.",
  },
];
