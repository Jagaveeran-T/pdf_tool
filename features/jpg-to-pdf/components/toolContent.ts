import type { ToolContent } from "@/components/content/types";

export const toolContent: ToolContent = {
  intro:
    "JPG to PDF is made for photographs: shots from a phone camera, snapped receipts, pictures of forms and ID cards. It wraps your JPEG files into a PDF while copying their original data across, so the pictures are not squeezed a second time. Add the photos, set their order, and download one PDF that is about as big as the photos themselves.",
  sections: [
    {
      id: "what-it-does",
      heading: "What it does with your photos",
      paragraphs: [
        "This tool takes JPG and JPEG files only and places each photo on its own page. If you try to add a PNG or WebP file, it is turned away with a message that points you to the Image to PDF tool, which handles mixed formats. Keeping the input to one format is what lets this tool treat your photos with such care.",
        "A job can hold up to 50 photos, with each file up to 50 MB and 200 MB for the batch. You can reorder the list by dragging or with the Move up and Move down buttons, remove photos you do not need and rotate individual shots in 90-degree steps. The finished document downloads as photos.pdf.",
      ],
    },
    {
      id: "original-data",
      heading: "Why the original JPEG data matters",
      paragraphs: [
        "JPEG is a lossy format. Every time a picture is decoded and saved again as a JPEG, a little more detail is thrown away. Many converters do exactly that without telling you. This tool avoids the extra round: when a photo is left as it is, its JPEG bytes are copied straight into the PDF, with no re-compression.",
        "There is one honest exception. If you rotate a photo, or if the camera stored an orientation flag that says the picture must be turned to look upright, the tool has to redraw the image. In that case it is re-encoded as a JPEG at quality 92, which costs a small amount of detail. Most people will not see the difference, but it is the reason we do not claim that nothing ever changes.",
        "A practical way to avoid the re-encode is to fix sideways photos before you add them, using your phone's gallery or photo viewer, so that the file itself is already upright.",
      ],
    },
    {
      id: "file-size",
      heading: "Predictable file size",
      paragraphs: [
        "Because the JPEG data is carried in unchanged, the PDF ends up roughly as large as the photos added together, plus a little overhead for the document structure. Ten photos of 3 MB each give a PDF of a bit over 30 MB. That makes it easy to plan ahead when a portal or email service limits attachments.",
        "There is no compression feature here, so the tool will not make a large file smaller. If the total is too big for where you need to send it, shrink the photos first by lowering their resolution in a photo editor or by choosing a smaller size when you share them from your phone, and then convert them.",
      ],
    },
    {
      id: "page-layout",
      heading: "Page size and layout for photos",
      paragraphs: [
        "The default page size is Fit to image, which makes every page match the proportions of its photo. That suits phone shots well, because nothing is cropped and there are no unexpected white bands. If the PDF will be printed or uploaded to a form that wants a standard sheet, switch to A4 or US Letter. The photo is then centred and scaled down to fit inside the margin you choose (None, Small or Medium), keeping its proportions.",
        "Orientation can be Auto, Portrait or Landscape. For a stack of receipts photographed at different angles, Auto is usually the sensible choice because each page follows the shape of its photo.",
      ],
    },
    {
      id: "everyday-uses",
      heading: "Everyday uses",
      paragraphs: [
        "The tool is aimed at paperwork you capture with a camera. Typical examples are a photographed ID card front and back for a rental or bank form, a set of receipts for an expense claim, a filled-in paper form, or pages of a handwritten assignment. Since each photo stays a JPEG inside the PDF, text on paper stays as readable as the camera captured it.",
        "Your photos are handled in your browser. They are read on your device, assembled in memory and offered as a download, and the conversion code does not send them to our servers. For personal documents, keep to the habit of working on copies and deleting the PDF once it has been submitted.",
      ],
      bullets: [
        "Photographed receipts and invoices",
        "Front and back of identity or membership cards",
        "Pictures of printed or handwritten forms",
        "Phone camera shots of notes and whiteboards",
      ],
    },
  ],
  howTo: {
    name: "How to turn JPG photos into a PDF",
    description:
      "Add your JPEG photos, order and rotate them, choose a page size and download a PDF that keeps the original photo data.",
    totalTime: "PT2M",
    steps: [
      {
        title: "Select your photos",
        text: "Drop your JPG or JPEG files into the tool, or browse for them. If a file is rejected, check that it is really a JPEG and not a PNG or WebP.",
      },
      {
        title: "Arrange the sequence",
        text: "Drag the thumbnails into reading order. For a receipt claim, a date order often works best; for an ID, put the front before the back.",
      },
      {
        title: "Straighten sideways shots",
        text: "Rotate any photo that looks turned. Remember that rotating means that photo is re-encoded at quality 92 rather than copied unchanged.",
      },
      {
        title: "Pick the page style",
        text: "Leave Fit to image for photo-shaped pages, or switch to A4 or US Letter for a standard sheet, then set the margin you prefer.",
      },
      {
        title: "Create the PDF",
        text: "Start the conversion. Because the photo data is copied rather than recalculated, the work is mostly assembling pages.",
      },
      {
        title: "Review the result",
        text: "Download photos.pdf, open it, and zoom in on small print such as amounts and dates to confirm they are still legible. Check the file size against any upload limit.",
      },
    ],
  },
  tips: [
    {
      title: "Photograph in good light",
      text: "A PDF cannot fix a blurry or shadowed photo. Shoot near a window, hold the phone parallel to the paper and keep the edges in frame.",
    },
    {
      title: "Fix orientation at the source",
      text: "Turn sideways photos upright in your gallery app first, so the converter can copy the file as it is.",
    },
    {
      title: "Estimate the size before converting",
      text: "Add up the sizes of your photos in your file manager. The PDF will be close to that total, which helps with email and portal limits.",
    },
    {
      title: "Reduce resolution on the phone",
      text: "If the total is too large, share the photos at a medium or small size from your phone and convert those, since this tool does not compress.",
    },
    {
      title: "Use A4 when a form expects a sheet",
      text: "Fit to image gives pages of odd proportions. Pick A4 or US Letter for anything that will be printed or filed with standard paper.",
    },
    {
      title: "Keep ID copies minimal",
      text: "Include only the sides that are actually requested, and delete the finished PDF after you have submitted it.",
    },
    {
      title: "Name files before you add them",
      text: "Names such as receipt-01 and receipt-02 make the order obvious in the list and save you from dragging things around.",
    },
    {
      title: "Send mixed formats elsewhere",
      text: "Screenshots and PNG files are not accepted here. Use the Image to PDF tool when your batch contains more than JPEGs.",
    },
  ],
  limitations: [
    "Only JPG and JPEG files are accepted; PNG, WebP and other formats are rejected with a message pointing to Image to PDF.",
    "The limits are 50 photos per job, 50 MB per file and 200 MB in total.",
    "Photos you rotate, or whose stored camera orientation must be applied, are re-encoded at JPEG quality 92, so they are not an exact copy of the original.",
    "There is no compression, so a PDF made from large photos will be large, roughly the total size of the photos.",
    "Each photo gets its own page, and the tool cannot crop, adjust brightness, straighten perspective or clean up a scan.",
    "The PDF contains pictures only: it does not recognise text, so you cannot search or copy words from a photographed page.",
    "Phones and older computers with little memory may fail on big batches, in which case try fewer photos at a time.",
  ],
};
