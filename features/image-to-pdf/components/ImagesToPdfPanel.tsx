"use client";
import { imageToPdfVariant } from "../config";
import { useImagesToPdf } from "../hooks/useImagesToPdf";
import { ImagesToPdfView } from "./ImagesToPdfView";

export default function ImagesToPdfPanel() {
  const state = useImagesToPdf(imageToPdfVariant);
  return <ImagesToPdfView variant={imageToPdfVariant} state={state} />;
}
