import { Stack } from "expo-router";
import { theme } from "@/src/utils";

export default function SearchLayout() {
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
                    title: "Search",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: theme["primary-text"] },
                    contentStyle: {
                        backgroundColor: theme.background,
                    },
                    headerSearchBarOptions: {
                        placement: "automatic",
                    },
                }}
            />
        </Stack>
    );
}
