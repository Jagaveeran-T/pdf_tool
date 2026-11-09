import type { CompressLevel, TargetKb } from "@/processing/operations/compressLevels";

export type CompressMode = "keep-text" | "flatten";
export type { CompressLevel, TargetKb };

export interface CompressModeOption {
  value: CompressMode;
  label: string;
  help: string;
}

export interface CompressLevelOption {
  value: CompressLevel;
  label: string;
  help: string;
}
