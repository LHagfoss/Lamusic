import { Stack, useRouter } from "expo-router";
import { useCSSVariable } from "uniwind";

export default function LibraryLayout() {
    const router = useRouter();
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
                    title: "Library",
                    headerLargeTitle: true,
                    headerLargeTitleStyle: { color: primaryTextColor },
                    contentStyle: { backgroundColor },
                    unstable_headerRightItems: () => [
                        {
                            type: "menu",
                            label: "More",
                            icon: { type: "sfSymbol", name: "ellipsis" },
                            menu: {
                                items: [
                                    {
                                        type: "action",
                                        label: "Upload Song",
                                        icon: {
                                            type: "sfSymbol",
                                            name: "plus",
                                        },
                                        onPress: () =>
                                            router.push(
                                                "/library/upload/upload",
                                            ),
                                    },
                                    {
                                        type: "action",
                                        label: "Placeholder",
                                        onPress: () => {},
                                    },
                                ],
                            },
                        },
                        {
                            type: "button",
                            label: "Saved",
                            icon: { type: "sfSymbol", name: "bookmark" },
                            onPress: () => {},
                        },
                        {
                            type: "button",
                            label: "Profile",
                            icon: {
                                type: "sfSymbol",
                                name: "person.crop.circle",
                            },
                            onPress: () => {},
                        },
                    ],
                }}
            />

            <Stack.Screen
                name="song"
                options={{
                    title: "",
                    contentStyle: { backgroundColor },
                }}
            />

            <Stack.Screen
                name="artist"
                options={{
                    title: "",
                    headerLargeTitle: false,
                    contentStyle: { backgroundColor },
                }}
            />

            <Stack.Screen
                name="album"
                options={{
                    title: "",
                    headerLargeTitle: false,
                    contentStyle: { backgroundColor },
                }}
            />

            <Stack.Screen
                name="upload/index"
                options={{
                    title: "Select Song",
                    contentStyle: { backgroundColor },
                }}
            />

            <Stack.Screen
                name="upload/artist"
                options={{
                    title: "Select Artist",
                    contentStyle: { backgroundColor },
                }}
            />

            <Stack.Screen
                name="upload/album"
                options={{
                    title: "Select Album",
                    contentStyle: { backgroundColor },
                }}
            />

            <Stack.Screen
                name="upload/review"
                options={{
                    title: "Review",
                    contentStyle: { backgroundColor },
                }}
            />

            <Stack.Screen
                name="upload/new-artist"
                options={{
                    title: "New Artist",
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.8, 1.0],
                    sheetGrabberVisible: true,
                }}
            />

            <Stack.Screen
                name="upload/new-album"
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
