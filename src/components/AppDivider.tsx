import { View } from "react-native";
import { useCSSVariable } from "uniwind";

export function AppDivider({ marginLeft = 76 }: { marginLeft?: number }) {
    const borderColor = useCSSVariable("--color-border")

    return (
        <View
            style={{
                height: 1,
                backgroundColor: borderColor,
                marginLeft,
            }}
        />
    );
}
