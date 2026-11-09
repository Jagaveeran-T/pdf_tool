"use client";
import { useSyncExternalStore } from "react";

export type ToolStatus = "idle" | "ready" | "processing" | "done" | "error";

let status: ToolStatus = "idle";
const listeners = new Set<() => void>();

/** Tiny shared store: tool widgets publish their state, AdPlacementGuard reads it. */
export function setToolStatus(next: ToolStatus): void {
  if (status === next) return;
  status = next;
  listeners.forEach((l) => l());
}

export function useToolStatus(): ToolStatus {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => status,
    () => "idle",
  );
}
