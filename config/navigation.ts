import { TOOL_LIST } from "./tools";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}
export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const toolLinks: NavLink[] = TOOL_LIST.map((t) => ({
  label: t.name,
  href: t.path,
  description: t.shortDescription,
}));

export const learnLinks: NavLink[] = [
  { label: "Guides", href: "/guides/" },
  { label: "Blog", href: "/blog/" },
  { label: "FAQ", href: "/faq/" },
];

export const companyLinks: NavLink[] = [
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Cookie Policy", href: "/cookie-policy/" },
  { label: "Terms of Use", href: "/terms/" },
  { label: "Disclaimer", href: "/disclaimer/" },
];

export const utilityLinks: NavLink[] = [{ label: "Sitemap", href: "/sitemap-page/" }];

/** Primary header links (desktop). Everything else lives under "More" and in the mobile menu. */
export const headerPrimary: NavLink[] = [...toolLinks, ...learnLinks];
export const headerMore: NavLink[] = [...companyLinks, ...legalLinks, ...utilityLinks];

export const footerGroups: NavGroup[] = [
  { title: "Tools", links: toolLinks },
  { title: "Learn", links: learnLinks },
  { title: "Company", links: [...companyLinks, ...utilityLinks] },
  { title: "Legal", links: legalLinks },
];

export const sitemapGroups: NavGroup[] = [
  { title: "Home", links: [{ label: "Home", href: "/" }] },
  { title: "PDF tools", links: toolLinks },
  ...footerGroups.filter((g) => g.title !== "Tools"),
];

export const staticPaths: string[] = [
  "/",
  ...toolLinks.map((l) => l.href),
  ...learnLinks.map((l) => l.href),
  ...companyLinks.map((l) => l.href),
  ...legalLinks.map((l) => l.href),
  ...utilityLinks.map((l) => l.href),
];
