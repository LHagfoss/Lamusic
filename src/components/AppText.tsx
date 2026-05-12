import { Text, type TextProps } from "react-native";
import { cn } from "@/src/lib/cn";
import { fontSizes, fontWeights, textAligns } from "@/src/constants";
import type { UIAlign, UIFontSize, UIVariant, UIWeight } from "./types";

export interface AppTextProps extends TextProps {
    variant?: UIVariant;
    size?: UIFontSize;
    weight?: UIWeight;
    align?: UIAlign;
    className?: string;
}

export function AppText({
    children,
    variant = "primary",
    size = "md",
    weight = "normal",
    align = "left",
    className,
    style,
    ...props
}: Readonly<AppTextProps>) {
    const variants: Record<UIVariant, string> = {
        primary: "text-foreground",
        secondary: "text-secondary-foreground",
        danger: "text-danger",
        success: "text-success",
        muted: "text-placeholder",
    };

    return (
        <Text
            className={cn(
                variants[variant],
                fontSizes[size],
                fontWeights[weight],
                textAligns[align],
                className,
            )}
            style={style}
            {...props}
        >
            {children}
        </Text>
    );
}
