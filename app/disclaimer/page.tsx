import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/content/LegalPage";
import { staticPageMeta } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.disclaimer!);

export default function Disclaimer() {
  return (
    <LegalPage
      title="Disclaimer"
      path="/disclaimer/"
      intro="Please read this short page so that you know what the tools do and what they do not promise."
    >
      <h2>Provided as is</h2>
      <p>The tools on {siteConfig.name} are provided without warranty of any kind. Always open the finished PDF, scroll through every page and check that it looks right before you send, print or submit it.</p>

      <h2>What the tools do not do</h2>
      <p>The site converts images to PDF, merges PDFs, splits PDFs and offers a limited PDF compressor that shrinks embedded JPEG images or flattens pages into pictures. Compression is lossy and cannot guarantee a result or a size. The site does not perform text recognition, remove passwords, edit text, sign documents or repair damaged files. Image-based PDFs made from photos cannot be searched or selected as text.</p>

      <h2>Results can vary</h2>
      <p>Output depends on your browser, device memory and the files you provide. Features such as bookmarks, form fields, tags and some metadata may not carry over when you merge or split. Page appearance can differ slightly between PDF viewers and printers.</p>

      <h2>Privacy claims</h2>
      <p>We state that files are processed in your browser and are not uploaded to our servers, and we have built the site so that this is true. We do not claim that any software is perfectly secure. Your device, browser extensions and the networks you use are outside our control. See the <Link href="/privacy-policy/">Privacy Policy</Link> for details.</p>

      <h2>Not professional advice</h2>
      <p>Articles and guides are general information. They are not legal, financial, medical or professional advice. If a document has legal weight, such as a contract or an official form, follow the instructions of the organisation requesting it and consult a qualified professional where needed. Check any size, format or page requirements with the recipient.</p>

      <h2>External links and advertising</h2>
      <p>Where the site links to other websites or displays ads, we have no control over them and are not responsible for their content or practices.</p>

      <h2>Contact</h2>
      <p>Spotted a mistake? Tell us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and we will correct it.</p>
    </LegalPage>
  );
}
