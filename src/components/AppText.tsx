import { Text, type TextProps } from "react-native";
import { fontSizes, fontWeights, textAligns } from "@/src/constants";
import { cn } from "@/src/lib/cn";
import type { UIAlign, UIFontSize, UIVariant, UIWeight } from "./types";

export interface AppTextProps extends TextProps {
    variant?: UIVariant;
    size?: UIFontSize;
    weight?: UIWeight;
    align?: UIAlign;
    className?: string;
    upperCase?: boolean;
}

export function AppText({
    children,
    variant = "primary",
    size = "md",
    weight = "normal",
    align = "left",
    className,
    style,
    upperCase = false,
    ...props
}: Readonly<AppTextProps>) {
    const variants: Record<UIVariant, string> = {
        primary: "text-primary-text",
        secondary: "text-secondary-foreground",
        danger: "text-danger",
        success: "text-success",
        muted: "text-placeholder",
    };

    if (upperCase) {
        children = children?.toString().toUpperCase();
    }

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
