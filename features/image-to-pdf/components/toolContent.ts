import type { ToolContent } from "@/components/content/types";

export const toolContent: ToolContent = {
  intro:
    "Image to PDF turns a pile of mixed pictures into one tidy PDF without leaving your browser. Drop in JPG, PNG and WebP files together, put them in the order you want, choose the page layout, and download a single document with one image per page. It is built for screenshots, graphics and downloaded images as much as for ordinary photos.",
  sections: [
    {
      id: "what-it-does",
      heading: "What this tool does",
      paragraphs: [
        "You can add up to 50 images at a time, with each file no larger than 50 MB and the whole batch no larger than 200 MB. The tool accepts JPG or JPEG, PNG and WebP, and you can mix all three in the same job. Each image becomes one page of the finished PDF, in the order shown on screen, and the result downloads as a file named images.pdf.",
        "Before you convert, you stay in control of the list. Drag a thumbnail to a new position, or use the Move up and Move down buttons if dragging is awkward on a touch screen. You can remove a picture you added by mistake and rotate any single image in 90-degree steps. Nothing is final until you press the convert button, so it is worth taking a moment to check the sequence.",
        "The tool does not look at the file extension alone. It reads the first bytes of every file to confirm what it really is, so a renamed document or a corrupt download is caught early and you get a message rather than a broken PDF.",
      ],
    },
    {
      id: "who-its-for",
      heading: "Who it is for",
      paragraphs: [
        "This tool suits people whose pictures do not all come from the same place. A typical job might include two phone screenshots, a PNG logo exported from a design app, a WebP image saved from a web page and a JPG from a camera. A converter that only accepts one format would force you to convert things first. Here, you can simply add everything at once.",
        "Students use it to assemble screenshots of lecture slides or online worksheets into one submission. Freelancers use it to package mock-ups and design previews for a client. Office workers use it to combine a screenshot of a confirmation page with a scanned signature, and people dealing with paperwork use it to gather a few supporting images into a single attachment.",
      ],
      bullets: [
        "Mixed batches of JPG, PNG and WebP",
        "Screenshots, charts, diagrams and logos",
        "Images saved from websites that use WebP",
        "Anyone who wants to decide page size, orientation and margins",
      ],
    },
    {
      id: "layout-control",
      heading: "Layout control: page size, orientation and margins",
      paragraphs: [
        "The layout options are the main difference between this tool and a plain converter. For page size you can choose A4 (210 x 297 mm), US Letter (8.5 x 11 in) or Fit to image, where each page takes the shape of its picture. Orientation can be Auto, Portrait or Landscape. With Auto, the tool picks the better fit for each picture, so a wide screenshot can sit on a landscape page while a tall one stays portrait.",
        "Margins can be None, Small or Medium. Every image is centred on its page and scaled down, when needed, so that it fits inside the margins. The proportions are always preserved, which means nothing is stretched or squashed. If an image is smaller than the printable area, it is not blown up to fill the space; it stays centred on the page.",
        "As a rule of thumb, choose Fit to image with no margin for a digital-only document where the pictures should look exactly as they were made. Choose A4 or US Letter with a small margin when the PDF will be printed or uploaded to a form that expects a standard page.",
      ],
    },
    {
      id: "output-quality",
      heading: "Output quality and transparency",
      paragraphs: [
        "How an image is stored depends on what happens to it. A JPEG or PNG that you do not rotate and that does not need an orientation correction is embedded directly, so its data is carried into the PDF as it was. WebP images are not stored directly in the PDF, so they are redrawn on a canvas and saved as PNG. Images you rotate are also redrawn, and so are JPEGs whose camera orientation information has to be applied. Redrawn JPEGs are re-encoded at quality 92, which keeps them looking good but is not a perfect copy of the original.",
        "So it would be wrong to say that conversion is always free of quality loss. Untouched JPEG and PNG files are not recompressed; rotated or corrected JPEGs lose a small amount of detail; and WebP images become lossless PNG, which can make them larger than the WebP original.",
        "PNG transparency is kept. Transparent areas are not filled with a colour by the tool, and most PDF viewers show them against a white page. If your logo has a see-through background and you plan to print it on coloured paper, remember that the page itself is still white.",
      ],
    },
    {
      id: "privacy",
      heading: "Privacy: your images stay on your device",
      paragraphs: [
        "Conversion happens inside your browser, in a background worker. The images are read from your device, turned into a PDF in memory and offered as a download. The conversion code does not send your files to our servers, and you can check this yourself by opening the Network tab in your browser's developer tools while you convert.",
        "Closing or refreshing the page discards everything it was holding, and the temporary download link is released shortly after the file is saved. This does not make any website risk-free, so for anything sensitive, work on copies and delete the output when you are done.",
      ],
    },
  ],
  howTo: {
    name: "How to combine images into one PDF",
    description:
      "Add JPG, PNG or WebP files, arrange and rotate them, pick a page layout and download a single PDF.",
    totalTime: "PT2M",
    steps: [
      {
        title: "Add your images",
        text: "Drag your JPG, PNG or WebP files onto the drop area, or use the browse button to select them. You can add up to 50 images, and you can add more later if you forget one.",
      },
      {
        title: "Put the pages in order",
        text: "Drag thumbnails into the sequence you want, or select an image and use Move up and Move down. Remove anything you added by accident with the remove button.",
      },
      {
        title: "Rotate where needed",
        text: "If a screenshot or picture appears sideways, rotate it in 90-degree steps. Check the thumbnail afterwards, because it shows how the page will look.",
      },
      {
        title: "Choose the layout",
        text: "Pick A4, US Letter or Fit to image, then set orientation to Auto, Portrait or Landscape and margin to None, Small or Medium.",
      },
      {
        title: "Convert the images",
        text: "Press the convert button and wait while your browser builds the document. Larger batches take longer because your own device does the work.",
      },
      {
        title: "Download and check",
        text: "Save images.pdf, open it and scroll through every page to confirm the order, rotation and margins before you send it anywhere.",
      },
    ],
  },
  tips: [
    {
      title: "Rename screenshots before you start",
      text: "Screenshots often have long, similar names. Renaming them 01, 02, 03 before adding them makes it easy to spot a wrong order in the list.",
    },
    {
      title: "Use Fit to image for design previews",
      text: "When the images are mock-ups or slides, Fit to image with no margin keeps every page exactly the proportions of the original picture.",
    },
    {
      title: "Use Auto orientation for mixed shapes",
      text: "If your batch has both wide and tall images, Auto avoids shrinking a landscape screenshot onto a portrait page.",
    },
    {
      title: "Mind transparent logos",
      text: "A PNG with a transparent background will sit on a white page. If you need a coloured background, add it in the image first.",
    },
    {
      title: "Trim huge images beforehand",
      text: "This tool does not compress. If a batch is close to the 200 MB limit, resize the pictures in your image editor first.",
    },
    {
      title: "Expect WebP files to grow",
      text: "WebP images are redrawn as PNG so that transparency survives, and the PDF may end up larger than the source files suggest.",
    },
    {
      title: "Check readability, not just order",
      text: "For text-heavy screenshots, zoom in on the finished PDF to confirm small writing is still legible at the page size you chose.",
    },
    {
      title: "Use the photo-specific tool for plain camera shots",
      text: "If every file is a JPEG photograph and you care about the file size, the JPG to PDF tool keeps those files as they are.",
    },
  ],
  limitations: [
    "Only JPG, JPEG, PNG and WebP files are accepted, so formats such as GIF, HEIC, TIFF and BMP need to be converted first.",
    "A job can contain up to 50 images, with 50 MB per file and 200 MB in total.",
    "Each image gets its own page, so you cannot place several pictures on one page or build a contact sheet.",
    "There is no compression feature, and WebP, rotated or orientation-corrected images are re-encoded, which can change both quality and file size.",
    "Transparent PNG areas appear white in most viewers because the page background is white.",
    "Very large batches or high-resolution images can fail on phones and older computers if the browser runs out of memory.",
    "The tool does not add text, captions, page numbers, watermarks or passwords, and it cannot make scanned text searchable.",
  ],
};
