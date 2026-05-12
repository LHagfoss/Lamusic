import { Stack } from "expo-router";
import { theme } from "@/src/utils";

export default function SavedLayout() {
    return (
        <Stack
            screenOptions={{
                headerBackButtonDisplayMode: "minimal",
                headerTransparent: true,
                headerTitleStyle: { color: theme["primary-text"] },
                contentStyle: { backgroundColor: theme.background },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Saved",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: theme["primary-text"] },
                    contentStyle: {
                        backgroundColor: theme.background,
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
