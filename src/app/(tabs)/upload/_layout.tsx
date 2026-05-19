import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function UploadLayout() {
    const primaryTextColor = String(useCSSVariable("--color-primary-text"));
    const backgroundColor = String(useCSSVariable("--color-background"));

    return (
        <Stack
            screenOptions={{
                headerBackButtonDisplayMode: "minimal",
                headerTransparent: true,
                headerTitleStyle: { color: primaryTextColor },
                headerStyle: { backgroundColor },
                contentStyle: { backgroundColor },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Upload",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: primaryTextColor },
                    contentStyle: { backgroundColor },
                }}
            />
            <Stack.Screen
                name="artist"
                options={{
                    title: "Select Artist",
                    contentStyle: { backgroundColor },
                }}
            />
            <Stack.Screen
                name="album"
                options={{
                    title: "Select Album",
                    contentStyle: { backgroundColor },
                }}
            />
            <Stack.Screen
                name="review"
                options={{
                    title: "Review",
                    contentStyle: { backgroundColor },
                }}
            />
            <Stack.Screen
                name="new-artist"
                options={{
                    title: "New Artist",
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.8, 1.0],
                    sheetGrabberVisible: true,
                }}
            />
            <Stack.Screen
                name="new-album"
                options={{
                    title: "New Album",
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.8, 1.0],
                    sheetGrabberVisible: true,
                }}
            />
        </Stack>
    );
}
