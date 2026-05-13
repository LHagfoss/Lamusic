import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { LegendList } from "@legendapp/list";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
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
    RowSkeleton,
    SavedRow,
    SegmentedControl,
} from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";
import { usePlayerStore } from "@/src/lib/playerStore";

const TABS = ["Songs", "Albums", "Artists"] as const;

export default function SearchScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const playTrack = usePlayerStore((s) => s.playTrack);
    const addToQueue = usePlayerStore((s) => s.addToQueue);
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    const [query, setQuery] = useState("");
    const [tabIndex, setTabIndex] = useState(0);

    const {
        useSearchSongs,
        useSearchAlbums,
        useSearchArtists,
        useRecentSongs,
    } = useMusic();

    const { data: songs = [], isFetching: songsFetching } =
        useSearchSongs(query);
    const { data: albums = [], isFetching: albumsFetching } =
        useSearchAlbums(query);
    const { data: artists = [], isFetching: artistsFetching } =
        useSearchArtists(query);
    const { data: recentSongs = [] } = useRecentSongs();

    const isLoading = songsFetching || albumsFetching || artistsFetching;

    const translateX = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    function handleTabChange(index: number) {
        setTabIndex(index);
        translateX.value = withTiming(-index * width, {
            duration: 400,
            easing: Easing.out(Easing.exp),
        });
    }

    function handleSongPress(item: any) {
        playTrack({
            id: item.id,
            title: item.title,
            artist: item.artists?.name,
            cover: { uri: item.cover_url || item.albums?.cover_url },
            url: item.audio_url,
            duration: item.duration,
        });
        router.push("/player");
    }

    function handleAlbumPress(item: any) {
        router.push({
            pathname: "/library/album",
            params: { albumId: item.id, artistName: item.artists?.name },
        });
    }

    function handleArtistPress(item: any) {
        router.push({
            pathname: "/library/artist",
            params: { name: item.name },
        });
    }

    function songTrackArg(item: any) {
        return {
            id: item.id,
            title: item.title,
            artist: item.artists?.name,
            cover: { uri: item.cover_url || item.albums?.cover_url },
            url: item.audio_url,
            duration: item.duration,
        };
    }

    const showEmpty = !query.trim();

    function SongRow({ item }: { item: any }) {
        return (
            <Host matchContents>
                <ContextMenu>
                    <ContextMenu.Trigger>
                        <SavedRow
                            item={item}
                            secondaryText={secondaryText}
                            type="Songs"
                            onPress={() => handleSongPress(item)}
                        />
                    </ContextMenu.Trigger>
                    <ContextMenu.Items>
                        <Button
                            label="Play"
                            systemImage="play.fill"
                            onPress={() => handleSongPress(item)}
                        />
                        <Button
                            label="Add to Queue"
                            systemImage="text.badge.plus"
                            onPress={() => addToQueue(songTrackArg(item))}
                        />
                        <Button
                            label="View Song"
                            systemImage="arrow.up.right"
                            onPress={() =>
                                router.push({
                                    pathname: "/library/song",
                                    params: { id: item.id },
                                })
                            }
                        />
                        <Button
                            label="View Artist"
                            systemImage="person"
                            onPress={() =>
                                router.push({
                                    pathname: "/library/artist",
                                    params: { name: item.artists?.name },
                                })
                            }
                        />
                    </ContextMenu.Items>
                </ContextMenu>
            </Host>
        );
    }

    function AlbumRow({ item }: { item: any }) {
        return (
            <Host matchContents>
                <ContextMenu>
                    <ContextMenu.Trigger>
                        <SavedRow
                            item={item}
                            secondaryText={secondaryText}
                            type="Albums"
                            onPress={() => handleAlbumPress(item)}
                        />
                    </ContextMenu.Trigger>
                    <ContextMenu.Items>
                        <Button
                            label="Open"
                            systemImage="arrow.up.right"
                            onPress={() => handleAlbumPress(item)}
                        />
                        <Button
                            label="View Artist"
                            systemImage="person"
                            onPress={() =>
                                router.push({
                                    pathname: "/library/artist",
                                    params: { name: item.artists?.name },
                                })
                            }
                        />
                    </ContextMenu.Items>
                </ContextMenu>
            </Host>
        );
    }

    function ArtistRow({ item }: { item: any }) {
        return (
            <Host matchContents>
                <ContextMenu>
                    <ContextMenu.Trigger>
                        <SavedRow
                            item={item}
                            secondaryText={secondaryText}
                            type="Artists"
                            onPress={() => handleArtistPress(item)}
                        />
                    </ContextMenu.Trigger>
                    <ContextMenu.Items>
                        <Button
                            label="Open"
                            systemImage="arrow.up.right"
                            onPress={() => handleArtistPress(item)}
                        />
                    </ContextMenu.Items>
                </ContextMenu>
            </Host>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerSearchBarOptions: {
                        placement: "automatic",
                        onChangeText: (e) => setQuery(e.nativeEvent.text),
                    },
                }}
            />

            <ScrollView
                className="flex-1 bg-background"
                contentInsetAdjustmentBehavior="automatic"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
            >
                {/* Empty state — recent songs */}
                {showEmpty && (
                    <View className="pt-4">
                        <AppText className="text-lg font-bold text-primary-text px-4 mb-2">
                            Recently Added
                        </AppText>
                        {recentSongs.length === 0 ? (
                            <View className="p-8 items-center">
                                <AppText className="text-secondary-text">
                                    No songs uploaded yet.
                                </AppText>
                            </View>
                        ) : (
                            recentSongs.map((item: any, i: number) => (
                                <View key={item.id}>
                                    <SongRow item={item} />
                                    {i < recentSongs.length - 1 && (
                                        <AppDivider />
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                )}

                {/* Search results */}
                {!showEmpty && (
                    <>
                        <SegmentedControl
                            values={TABS}
                            selectedIndex={tabIndex}
                            onChange={handleTabChange}
                        />

                        {isLoading && (
                            <View>
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <RowSkeleton key={i} delay={i * 50} />
                                ))}
                            </View>
                        )}

                        {!isLoading && (
                            <Animated.View
                                style={[
                                    { flexDirection: "row", width: width * 3 },
                                    animatedStyle,
                                ]}
                            >
                                {/* Songs tab */}
                                <View style={{ width }}>
                                    <LegendList
                                        data={songs}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                        ItemSeparatorComponent={() => (
                                            <AppDivider />
                                        )}
                                        renderItem={({ item }) => (
                                            <SongRow item={item} />
                                        )}
                                        ListEmptyComponent={() => (
                                            <View className="p-8 items-center">
                                                <AppText className="text-secondary-text">
                                                    No songs found.
                                                </AppText>
                                            </View>
                                        )}
                                    />
                                </View>

                                {/* Albums tab */}
                                <View style={{ width }}>
                                    <LegendList
                                        data={albums}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                        ItemSeparatorComponent={() => (
                                            <AppDivider />
                                        )}
                                        renderItem={({ item }) => (
                                            <AlbumRow item={item} />
                                        )}
                                        ListEmptyComponent={() => (
                                            <View className="p-8 items-center">
                                                <AppText className="text-secondary-text">
                                                    No albums found.
                                                </AppText>
                                            </View>
                                        )}
                                    />
                                </View>

                                {/* Artists tab */}
                                <View style={{ width }}>
                                    <LegendList
                                        data={artists}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                        ItemSeparatorComponent={() => (
                                            <AppDivider />
                                        )}
                                        renderItem={({ item }) => (
                                            <ArtistRow item={item} />
                                        )}
                                        ListEmptyComponent={() => (
                                            <View className="p-8 items-center">
                                                <AppText className="text-secondary-text">
                                                    No artists found.
                                                </AppText>
                                            </View>
                                        )}
                                    />
                                </View>
                            </Animated.View>
                        )}
                    </>
                )}
            </ScrollView>
        </>
    );
}
