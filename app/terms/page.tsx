import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { staticPageMeta } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.terms!);

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      path="/terms/"
      intro={`By using ${siteConfig.name} you agree to these terms. They are written to be read, so please do.`}
    >
      <h2>The service</h2>
      <p>The site offers free browser-based tools to convert images to PDF, merge PDF files, split PDF files and compress PDF files. Compression is lossy and cannot guarantee a particular result or file size. The tools run on your device. They are provided for lawful, personal and business use.</p>

      <h2>What you may do</h2>
      <ul>
        <li>Use the tools on your own documents or documents you have permission to handle.</li>
        <li>Download and keep the results.</li>
        <li>Link to the site.</li>
      </ul>

      <h2>What you may not do</h2>
      <ul>
        <li>Use the tools to process material that you have no right to copy or that is unlawful.</li>
        <li>Attempt to disrupt, overload or probe the site for weaknesses, or interfere with the advertising it carries.</li>
        <li>Copy the site text, articles or design and present them as your own.</li>
        <li>Click on ads artificially or encourage others to do so.</li>
      </ul>

      <h2>Your files and responsibility</h2>
      <p>You keep all rights in your files and in the PDFs you create. Because processing happens on your device, you are responsible for keeping your own copies, for checking each result before you rely on it, and for having the right to handle the documents you use. Do not use the tools as the only copy of an important document.</p>

      <h2>No warranty</h2>
      <p>The tools and content are provided as is and as available. We try to make them accurate and reliable, but we do not promise that they will be uninterrupted, error free, suitable for a particular purpose or free of defects. Some PDF features, such as bookmarks, form fields and accessibility tags, may not survive merging or splitting. Large files can fail on devices with limited memory.</p>

      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, we are not liable for any loss or damage arising from use of, or inability to use, the site, including lost files, lost data or lost profit. Nothing in these terms excludes liability that cannot be excluded by law, and nothing limits your statutory consumer rights.</p>

      <h2>Advertising and third-party links</h2>
      <p>The site may show advertising provided by Google. We do not control the content of ads or of third-party sites we link to, and we do not endorse them.</p>

      <h2>Changes</h2>
      <p>We may change the site or these terms from time to time. The date at the top shows the latest update. Continued use after a change means you accept the new terms.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
    </LegalPage>
  );
}
