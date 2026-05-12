import { Host, Label, Button as SwiftUIButton } from "@expo/ui/swift-ui";
import {
    buttonStyle,
    controlSize,
    disabled as disabledModifier,
    font,
    foregroundStyle,
    frame,
    tint,
} from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Platform, View, type ViewStyle } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText } from "./AppText";

export interface AppButtonProps {
    title: string;
    onPress?: () => void;
    /**
     * @default "primary"
     */
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
    /**
     * If true, button will fill available width (100%) using robust stretch logic
     */
    fill?: boolean;
    /**
     * Optional SF Symbol name
     */
    icon?: string;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

const isIOS = Platform.OS === "ios";

export function AppButton({
    title,
    onPress,
    variant = "primary",
    fill = false,
    icon,
    disabled = false,
    loading = false,
    style,
}: Readonly<AppButtonProps>) {
    const primary = String(useCSSVariable("--color-primary"));
    const error = String(useCSSVariable("--color-danger"));
    const onPrimary = String(useCSSVariable("--color-on-primary-text"));
    const secondary = String(useCSSVariable("--color-secondary-text"));

    const [measuredWidth, setMeasuredWidth] = useState(0);

    const isDisabled = disabled || loading;

    const swiftStyle = isIOS
        ? variant === "primary"
            ? "glassProminent"
            : variant === "ghost"
              ? "borderless"
              : "glass"
        : variant === "primary"
          ? "borderedProminent"
          : variant === "outline" || variant === "danger"
            ? "bordered"
            : "borderless";

    const accentColor = variant === "danger" ? error : primary;
    let textColor = variant === "primary" ? onPrimary : accentColor;
    if (variant === "secondary") textColor = secondary;

    const horizontalPadding = icon ? 60 : 48;
    const dynamicWidth =
        measuredWidth > 0 ? measuredWidth + horizontalPadding : undefined;

    return (
        <View
            style={[
                {
                    alignSelf: fill ? "stretch" : "flex-start",
                },
                style,
            ]}
        >
            {!fill && (
                <View
                    style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                    }}
                >
                    <AppText
                        weight="bold"
                        className="text-base"
                        onLayout={(e) =>
                            setMeasuredWidth(e.nativeEvent.layout.width)
                        }
                    >
                        {title}
                    </AppText>
                </View>
            )}

            <Host
                style={{
                    height: 56,
                    width: fill ? "100%" : (dynamicWidth as any),
                }}
            >
                <SwiftUIButton
                    modifiers={
                        [
                            buttonStyle(swiftStyle as any),
                            tint(accentColor),
                            controlSize("large"),
                            disabledModifier(isDisabled),
                            fill && frame({ maxWidth: Infinity }),
                        ].filter(Boolean) as any
                    }
                    onPress={() => {
                        if (isDisabled) return;
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onPress?.();
                    }}
                >
                    <Label
                        title={loading ? "Loading..." : title}
                        modifiers={
                            [
                                foregroundStyle(textColor),
                                font({ weight: "bold" }),
                                fill && frame({ maxWidth: Infinity }),
                            ].filter(Boolean) as any
                        }
                    />
                </SwiftUIButton>
            </Host>
        </View>
    );
}
