import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function ProfileLayout() {
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
                    title: "Profile",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: primaryTextColor },
                    contentStyle: {
                        backgroundColor,
                    },
                }}
            />
            <Stack.Screen
                name="my-content/index"
                options={{
                    title: "My Content",
                    headerLargeTitle: false,
                }}
            />
            <Stack.Screen
                name="my-content/manage"
                options={{
                    title: "",
                    presentation: "formSheet",
                    headerShown: false,
                    sheetAllowedDetents: [0.4],
                    sheetGrabberVisible: true,
                }}
            />
            <Stack.Screen
                name="my-content/edit"
                options={{
                    title: "",
                    presentation: "formSheet",
                    headerShown: true,
                    headerTransparent: true,
                    sheetAllowedDetents: [0.6, 1.0],
                    sheetGrabberVisible: true,
                }}
            />
        </Stack>
    );
}
