"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "./ToolSkeleton";

/** The tool code (and pdf-lib, via the worker) is loaded only in the browser, after the page is visible. */
const Panel = dynamic(() => import("@/features/merge-pdf/components/MergePdfPanel"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export function MergePdfTool() {
  return <Panel />;
}
