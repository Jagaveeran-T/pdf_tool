import { siteConfig } from "./site";

export interface PageMeta {
  title: string;
  description: string;
  path: string;
}

export const defaultMeta = {
  title: `${siteConfig.name}: Free PDF Tools That Run in Your Browser`,
  description:
    "Convert images to PDF, merge PDFs and split PDFs for free. Everything is processed locally in your browser, so your files are never uploaded to a server.",
  ogImage: "/og/default.png",
};

export const staticPageMeta: Record<string, PageMeta> = {
  home: { title: defaultMeta.title, description: defaultMeta.description, path: "/" },
  blog: {
    title: "PDF Blog: Practical Tips and Explainers",
    description: "Plain-language articles on JPG vs PNG for PDF, page sizes, scanning, file size and safe PDF habits.",
    path: "/blog/",
  },
  guides: {
    title: "PDF Guides: Step-by-Step How-Tos",
    description: "Detailed walkthroughs for converting images to PDF, merging PDF files and splitting a PDF into pages.",
    path: "/guides/",
  },
  faq: {
    title: "PDF Tools FAQ: Privacy, Limits and Troubleshooting",
    description: "Answers about how local processing works, file limits, supported formats and common errors.",
    path: "/faq/",
  },
  about: {
    title: `About ${siteConfig.name}`,
    description: `Who runs ${siteConfig.name}, why the tools run in your browser, and how the site is funded.`,
    path: "/about/",
  },
  contact: {
    title: "Contact Us",
    description: `Send feedback, report a bug or ask a question. You can also email ${siteConfig.email} directly.`,
    path: "/contact/",
  },
  privacy: {
    title: "Privacy Policy",
    description: "What data this site handles, how files stay on your device, and how Google AdSense, cookies and analytics work.",
    path: "/privacy-policy/",
  },
  cookies: {
    title: "Cookie Policy",
    description: "Which cookies and similar storage this site uses, what each is for, and how to change your choices.",
    path: "/cookie-policy/",
  },
  terms: {
    title: "Terms of Use",
    description: "The rules for using the PDF tools, the limits of the service and your responsibilities.",
    path: "/terms/",
  },
  disclaimer: {
    title: "Disclaimer",
    description: "Important limits: the tools are provided as is, results should be checked, and this is not legal advice.",
    path: "/disclaimer/",
  },
  sitemap: {
    title: "HTML Sitemap",
    description: "A complete list of every page on the site: tools, guides, blog posts and policies.",
    path: "/sitemap-page/",
  },
};
