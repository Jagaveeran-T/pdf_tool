import { z } from "zod";

const fileSchema = z.custom<File>((v) => typeof File !== "undefined" && v instanceof File, "Expected a File");

export const imagesToPdfOptionsSchema = z.object({
  pageSize: z.enum(["a4", "letter", "fit"]),
  orientation: z.enum(["auto", "portrait", "landscape"]),
  margin: z.enum(["none", "small", "medium"]),
});
export type ImagesToPdfOptions = z.infer<typeof imagesToPdfOptionsSchema>;

/** Clockwise rotation in degrees, applied per file. */
export const rotationSchema = z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]);
export type Rotation = z.infer<typeof rotationSchema>;

export const imagesToPdfPayloadSchema = z
  .object({
    operation: z.literal("images-to-pdf"),
    files: z.array(fileSchema).min(1).max(200),
    rotations: z.array(rotationSchema).optional(),
    options: imagesToPdfOptionsSchema,
    outputName: z.string().max(120).optional(),
  })
  .refine((v) => !v.rotations || v.rotations.length === v.files.length, "rotations must match files");

export const mergePayloadSchema = z
  .object({
    operation: z.literal("merge-pdf"),
    files: z.array(fileSchema).min(2).max(200),
    rotations: z.array(rotationSchema).optional(),
    outputName: z.string().max(120).optional(),
  })
  .refine((v) => !v.rotations || v.rotations.length === v.files.length, "rotations must match files");

export const splitModeSchema = z.enum(["extract", "ranges", "each-page"]);
export type SplitMode = z.infer<typeof splitModeSchema>;

export const splitPayloadSchema = z.object({
  operation: z.literal("split-pdf"),
  file: fileSchema,
  mode: splitModeSchema,
  ranges: z.string().max(2000).optional(),
});

export const compressPayloadSchema = z.object({
  operation: z.literal("compress-pdf"),
  file: fileSchema,
  /** keep-text: shrink embedded JPEG images only. flatten: turn each page into a picture. */
  mode: z.enum(["keep-text", "flatten"]),
  level: z.enum(["balanced", "smaller", "smallest"]),
  /** Size target in KB for flatten mode; 0 means none. */
  targetKb: z.union([z.literal(0), z.literal(100), z.literal(200), z.literal(500), z.literal(1024)]).default(0),
  grayscale: z.boolean().default(false),
});

export const payloadSchema = z.union([
  imagesToPdfPayloadSchema,
  mergePayloadSchema,
  splitPayloadSchema,
  compressPayloadSchema,
]);

export type ImagesToPdfPayload = z.infer<typeof imagesToPdfPayloadSchema>;
export type MergePayload = z.infer<typeof mergePayloadSchema>;
export type SplitPayload = z.infer<typeof splitPayloadSchema>;
export type CompressPayload = z.infer<typeof compressPayloadSchema>;
export type ProcessingPayload = z.infer<typeof payloadSchema>;
