import { LegendList } from "@legendapp/list";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
    ActivityIndicator,
    ScrollView,
    useWindowDimensions,
    View,
    RefreshControl,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import {
    AppDivider,
    AppText,
    SavedRow,
    SegmentedControl,
} from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";

const TABS = ["Songs", "Albums", "Artists"] as const;

export default function MyContentScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);

    const { useMyContent } = useMusic();
    const { data: myContent, isLoading, refetch } = useMyContent();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const translateX = useSharedValue(0);
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const primaryColor = String(useCSSVariable("--color-primary"));

    const [songs, setSongs] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [artists, setArtists] = useState<any[]>([]);

    useEffect(() => {
        if (!myContent) return;

        const initialSongs =
            myContent.flatMap(
                (a) =>
                    a.albums?.flatMap(
                        (al: any) =>
                            al.songs?.map((s: any) => ({
                                ...s,
                                artists: { name: a.name },
                                albums: { cover_url: al.cover_url },
                            })) || [],
                    ) || [],
            ) || [];
        setSongs(initialSongs);

        const initialAlbums =
            myContent.flatMap(
                (a) =>
                    a.albums?.map((al: any) => ({
                        ...al,
                        artists: { name: a.name },
                    })) || [],
            ) || [];
        setAlbums(initialAlbums);

        const initialArtists = myContent || [];
        setArtists(initialArtists);
    }, [myContent]);

    useEffect(() => {
        translateX.value = withTiming(-tabIndex * width, {
            duration: 400,
            easing: Easing.out(Easing.exp),
        });
    }, [tabIndex, width, translateX]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handlePress = (item: any, type: string) => {
        router.push({
            pathname: "/(tabs)/profile/my-content/manage",
            params: {
                id: item.id,
                type,
                title: type === "Artists" ? item.name : item.title,
                image:
                    type === "Artists"
                        ? item.image_url
                        : type === "Albums"
                          ? item.cover_url
                          : item.cover_url || item.albums?.cover_url,
                artistName:
                    type === "Songs"
                        ? item.artists?.name
                        : type === "Albums"
                          ? item.artists?.name
                          : undefined,
                artistId:
                    type === "Songs"
                        ? item.artist_id
                        : type === "Albums"
                          ? item.artist_id
                          : undefined,
                albumId: type === "Songs" ? item.album_id : undefined,
                audioUrl: type === "Songs" ? item.audio_url : undefined,
                duration: type === "Songs" ? item.duration : undefined,
            },
        });
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={primaryColor}
                />
            }
        >
            <Stack.Screen
                options={{
                    title: "My Content",
                    headerLargeTitle: false,
                }}
            />
            <SegmentedControl
                values={TABS}
                selectedIndex={tabIndex}
                onChange={setTabIndex}
            />

            <Animated.View
                style={[
                    { flexDirection: "row", width: width * 3, flex: 1 },
                    animatedStyle,
                ]}
            >
                <View style={{ width }}>
                    <LegendList
                        data={songs}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => <AppDivider />}
                        renderItem={({ item }) => (
                            <SavedRow
                                item={item}
                                secondaryText={secondaryText}
                                type="Songs"
                                onPress={() => handlePress(item, "Songs")}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View className="p-8 items-center">
                                <AppText className="text-secondary-text">
                                    No songs uploaded yet.
                                </AppText>
                            </View>
                        )}
                    />
                </View>
                <View style={{ width }}>
                    <LegendList
                        data={albums}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => <AppDivider />}
                        renderItem={({ item }) => (
                            <SavedRow
                                item={item}
                                secondaryText={secondaryText}
                                type="Albums"
                                onPress={() => handlePress(item, "Albums")}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View className="p-8 items-center">
                                <AppText className="text-secondary-text">
                                    No albums created yet.
                                </AppText>
                            </View>
                        )}
                    />
                </View>
                <View style={{ width }}>
                    <LegendList
                        data={artists}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => <AppDivider />}
                        renderItem={({ item }) => (
                            <SavedRow
                                item={item}
                                secondaryText={secondaryText}
                                type="Artists"
                                onPress={() => handlePress(item, "Artists")}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View className="p-8 items-center">
                                <AppText className="text-secondary-text">
                                    No artists created yet.
                                </AppText>
                            </View>
                        )}
                    />
                </View>
            </Animated.View>
        </ScrollView>
    );
}
