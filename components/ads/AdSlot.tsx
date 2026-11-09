"use client";
import { useEffect, useRef } from "react";
import { adsConfig, type PageType, type Placement } from "@/config/ads";
import { AdPlacementGuard } from "./AdPlacementGuard";

interface Props {
  pageType: PageType;
  placement: Placement;
  contentWords: number;
}

function Unit({ placement }: { placement: Placement }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ||= []).push({});
    } catch {
      /* ad blockers or script failures must never affect the page */
    }
  }, []);
  return (
    <aside aria-label="Advertisement" className="my-10">
      <p className="mb-1 text-center text-[11px] font-medium uppercase tracking-widest text-ink-faint">Advertisement</p>
      <div className="overflow-hidden rounded-lg border border-dashed border-surface-line bg-white" style={{ minHeight: adsConfig.minHeight[placement] }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: adsConfig.minHeight[placement] }}
          data-ad-client={adsConfig.clientId}
          data-ad-slot={adsConfig.slots[placement]}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}

/** Reusable responsive ad unit with reserved height. Never rendered unless the guard allows it. */
export function AdSlot(props: Props) {
  return (
    <AdPlacementGuard {...props}>
      <Unit placement={props.placement} />
    </AdPlacementGuard>
  );
}
