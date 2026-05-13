import { requireNativeView } from "expo";
import React from "react";
import { Platform } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

interface AirplayButtonProps {
    tintColor?: string;
    activeTintColor?: string;
    style?: StyleProp<ViewStyle>;
}

const NativeAirplayButton =
    Platform.OS === "ios"
        ? requireNativeView<AirplayButtonProps>("AirplayButton")
        : null;

export function AirplayButton({ style, tintColor, activeTintColor }: AirplayButtonProps) {
    if (!NativeAirplayButton) return null;
    return (
        <NativeAirplayButton
            style={style}
            tintColor={tintColor}
            activeTintColor={activeTintColor}
        />
    );
}
