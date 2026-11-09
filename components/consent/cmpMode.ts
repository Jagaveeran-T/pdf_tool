export type CmpMode = "custom" | "google-fc";

/** "custom" = built-in banner (non-personalised ads only). "google-fc" = Google Funding Choices, a certified CMP. */
export const CMP_MODE: CmpMode = process.env.NEXT_PUBLIC_CMP_MODE === "google-fc" ? "google-fc" : "custom";
