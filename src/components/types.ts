import type {
    fontSizes,
    fontWeights,
    roundedVariants,
    textAligns,
} from "@/src/constants/variants";

export type UIFontSize = keyof typeof fontSizes;
export type UIWeight = keyof typeof fontWeights;
export type UIRounded = keyof typeof roundedVariants;
export type UIAlign = keyof typeof textAligns;

export type UIComponentSize = "none" | "xs" | "sm" | "md" | "lg";
export type UIVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "muted";
