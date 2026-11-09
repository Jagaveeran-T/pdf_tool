"use client";
import { ImagesToPdfView } from "@/features/image-to-pdf/components/ImagesToPdfView";
import { jpgToPdfVariant } from "../config";
import { useJpgToPdf } from "../hooks/useJpgToPdf";

export default function JpgToPdfPanel() {
  const state = useJpgToPdf();
  return <ImagesToPdfView variant={jpgToPdfVariant} state={state} />;
}
