/** Shared by the compression operations and the UI, so the wording on screen always matches what the code does. */
export type CompressLevel = "balanced" | "smaller" | "smallest";

export interface ImageLevel {
  /** Longest side, in pixels, that an embedded image is scaled down to (never scaled up). */
  maxSide: number;
  /** JPEG quality from 0 to 1. */
  quality: number;
}

/** "Keep text" mode: settings for the embedded JPEG images. */
export const IMAGE_LEVELS: Record<CompressLevel, ImageLevel> = {
  balanced: { maxSide: 2000, quality: 0.75 },
  smaller: { maxSide: 1500, quality: 0.6 },
  smallest: { maxSide: 1000, quality: 0.45 },
};

export interface RenderStep {
  /** pdf.js scale: 1 means 72 pixels per inch of page. */
  scale: number;
  quality: number;
}

/** "Flatten pages" mode: from best quality (index 0) to smallest files (last index). */
export const RENDER_LADDER: readonly RenderStep[] = [
  { scale: 2.0, quality: 0.8 },
  { scale: 1.75, quality: 0.72 },
  { scale: 1.5, quality: 0.65 },
  { scale: 1.25, quality: 0.55 },
  { scale: 1.0, quality: 0.45 },
  { scale: 0.85, quality: 0.38 },
  { scale: 0.7, quality: 0.3 },
  { scale: 0.55, quality: 0.25 },
];

/** Ladder index used when the visitor picks a level but no size target. */
export const LEVEL_START_INDEX: Record<CompressLevel, number> = { balanced: 2, smaller: 4, smallest: 6 };

/** Browsers refuse or crash on very large canvases (iOS Safari is around 16.7 million pixels). */
export const MAX_CANVAS_PIXELS = 12_000_000;

/** Size targets offered in flatten mode, in kilobytes. 0 means "no target, use the level". */
export const TARGETS_KB = [0, 100, 200, 500, 1024] as const;
export type TargetKb = (typeof TARGETS_KB)[number];
