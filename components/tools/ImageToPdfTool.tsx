"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "./ToolSkeleton";

/** The tool code (and pdf-lib, via the worker) is loaded only in the browser, after the page is visible. */
const Panel = dynamic(() => import("@/features/image-to-pdf/components/ImagesToPdfPanel"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export function ImageToPdfTool() {
  return <Panel />;
}
