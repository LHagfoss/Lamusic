import { Stack } from "expo-router";
import { theme } from "@/src/utils";

export default function ProfileLayout() {
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
                    title: "Profile",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: theme["primary-text"] },
                    contentStyle: {
                        backgroundColor: theme.background,
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
