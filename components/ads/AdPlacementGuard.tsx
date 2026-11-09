"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { adsConfig, adsReady, isPathBlocked, isPlacementAllowed, type PageType, type Placement } from "@/config/ads";
import { useConsent } from "@/hooks/useConsent";
import { useToolStatus } from "@/lib/toolStatus";

interface Props {
  pageType: PageType;
  placement: Placement;
  /** Words of publisher content on the page. Pages below the minimum never show ads. */
  contentWords: number;
  children: ReactNode;
}

/**
 * The single gate every ad passes through. Renders nothing unless ALL of these hold:
 * ads enabled and valid publisher ID; slot ID present; consent allows ads; the placement is allowed for the page type;
 * the path is not a legal/contact/404 page; the page has enough content; and the tool is not empty, in error, processing or showing a download.
 */
export function AdPlacementGuard({ pageType, placement, contentWords, children }: Props) {
  const pathname = usePathname() ?? "/";
  const { canLoadAds } = useConsent();
  const toolStatus = useToolStatus();

  if (!adsReady()) return null;
  if (!adsConfig.slots[placement]) return null;
  if (!canLoadAds) return null;
  if (!isPlacementAllowed(pageType, placement)) return null;
  if (isPathBlocked(pathname)) return null;
  if (contentWords < adsConfig.minContentWords) return null;
  if (pageType === "tool" && (adsConfig.hiddenWhenToolStatus as readonly string[]).includes(toolStatus)) return null;
  return <>{children}</>;
}
