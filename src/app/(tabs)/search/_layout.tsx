import { Stack } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function SearchLayout() {
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
                    title: "Search",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: primaryTextColor },
                    contentStyle: {
                        backgroundColor,
                    },
                    headerSearchBarOptions: {
                        placement: "automatic",
                    },
                }}
            />
        </Stack>
    );
}
