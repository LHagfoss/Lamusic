import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function SavedLayout() {
    const primaryTextColor = String(useCSSVariable("--color-primary-text"));
    const backgroundColor = String(useCSSVariable("--color-background"));

    return (
        <Stack
            screenOptions={{
                headerBackButtonDisplayMode: "minimal",
                headerTransparent: true,
                headerTitleStyle: { color: primaryTextColor },
                contentStyle: { backgroundColor },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Saved",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: primaryTextColor },
                    contentStyle: {
                        backgroundColor,
                    },
                }}
            />
            <Stack.Screen
                name="detail"
                options={{
                    title: "Detail",
                    presentation: "formSheet",
                    headerShown: false,
                    sheetAllowedDetents: [0.4],
                    sheetGrabberVisible: true,
                }}
            />
        </Stack>
    );
}
