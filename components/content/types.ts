export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface HowToStep {
  title: string;
  text: string;
}

export interface TipItem {
  title: string;
  text: string;
}

/** Long-form, unique copy rendered under every tool. All text is plain strings (no HTML/markdown). */
export interface ToolContent {
  /** 2-3 sentences shown under the H1. */
  intro: string;
  /** Main explanatory sections (what it does, who it is for, how output looks, privacy). */
  sections: ToolSection[];
  howTo: { name: string; description: string; totalTime: string; steps: HowToStep[] };
  tips: TipItem[];
  /** Honest limitations. */
  limitations: string[];
}
