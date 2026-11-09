import type { SplitMode } from "@/processing/contracts/payloads";

export type { SplitMode };

export interface SplitModeOption {
  value: SplitMode;
  label: string;
  help: string;
}
