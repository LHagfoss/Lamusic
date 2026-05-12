import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { LegendList } from "@legendapp/list";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableOpacity, PressableScale } from "pressto";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import { AppButton } from "@/src/components";
import { AppText } from "@/src/components/AppText";
import { useMusic } from "@/src/hooks/useMusic";
import { usePlayerStore } from "@/src/lib/playerStore";

export default function ArtistScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { useLibrary, useToggleArtistFavorite } = useMusic();
    const { data: library, isLoading } = useLibrary();
    const toggleArtistFavoriteMutation = useToggleArtistFavorite();

    const [shuffleOn, setShuffleOn] = useState(false);

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const onPrimaryText = String(useCSSVariable("--color-on-primary-text"));
    const backgroundColor = String(useCSSVariable("--color-background"));

    const playQueue = usePlayerStore((s) => s.playQueue);

    const artist = library?.find((a) => a.name === name);
    const isLiked = artist?.is_favorite ?? false;

    const handleToggleFavorite = async () => {
        if (!artist?.id) return;
        try {
            await toggleArtistFavoriteMutation.mutateAsync({
                artistId: artist.id,
                isFavorite: !isLiked,
            });
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!artist) {
        return (
            <View className="flex-1 items-center justify-center">
                <AppText className="text-secondary-text">
                    Artist not found
                </AppText>
            </View>
        );
    }

    const heroImage = artist.image_url;
    const allTracks =
        artist.albums?.flatMap((al: any) =>
            (al.songs || []).map((s: any) => ({
                ...s,
                albumCoverUrl: al.cover_url,
            })),
        ) || [];

    const handlePlayArtistPress = async () => {
        if (allTracks.length === 0) return;
        const tracks = allTracks.map((t: any) => ({
            id: t.id,
            title: t.title,
            artist: artist.name,
            cover: { uri: t.albumCoverUrl },
            url: t.audio_url,
            duration: t.duration,
        }));
        await playQueue(tracks, 0);
        router.push("/player");
    };

    const handleSongPress = (album: any) => {
        router.push({
            pathname: "/library/album",
            params: {
                albumId: album.id,
                artistName: artist.name,
            },
        });
    };

    return (
        <>
            {isFocused && (
                <Stack.Screen
                    options={{
                        title: artist.name,
                        unstable_headerRightItems: () => [
                            {
                                type: "button",
                                label: "Like",
                                icon: {
                                    type: "sfSymbol",
                                    name: isLiked ? "heart.fill" : "heart",
                                },
                                onPress: handleToggleFavorite,
                            },
                            {
                                type: "menu",
                                label: "More",
                                icon: { type: "sfSymbol", name: "ellipsis" },
                                menu: {
                                    items: [
                                        {
                                            type: "action",
                                            label: "Share",
                                            onPress: () => {},
                                        },
                                        {
                                            type: "action",
                                            label: "Add to Library",
                                            onPress: () => {},
                                        },
                                    ],
                                },
                            },
                        ],
                    }}
                />
            )}

            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-safe p-4"
            >
                <View className="overflow-hidden rounded-3xl w-full aspect-3/2 bg-secondary items-center justify-center">
                    {heroImage ? (
                        <Image
                            source={{ uri: heroImage }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                        />
                    ) : (
                        <SymbolView
                            name="person.fill"
                            size={60}
                            tintColor={secondaryText}
                        />
                    )}
                </View>

                <View>
                    <View className="pt-6 pb-2 flex-row items-start justify-between gap-4">
                        <View className="flex-1">
                            <AppText className="text-3xl font-bold text-primary-text">
                                {artist.name}
                            </AppText>

                            <AppButton title="Follow" />
                        </View>

                        <View className="flex-row items-center gap-3">
                            <Pressable onPress={() => setShuffleOn((v) => !v)}>
                                <GlassView
                                    style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 26,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    isInteractive
                                >
                                    <SymbolView
                                        name="shuffle"
                                        size={22}
                                        tintColor={
                                            shuffleOn
                                                ? onPrimaryText
                                                : secondaryText
                                        }
                                    />
                                </GlassView>
                            </Pressable>

                            <Pressable onPress={handlePlayArtistPress}>
                                <GlassView
                                    style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 26,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    isInteractive
                                >
                                    <SymbolView
                                        name="play.fill"
                                        size={20}
                                        tintColor={primaryText}
                                    />
                                </GlassView>
                            </Pressable>
                        </View>
                    </View>

                    <View className="mb-6 pt-4">
                        <AppText className="text-lg font-bold text-primary-text mb-3">
                            Songs
                        </AppText>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                gap: 12,
                            }}
                        >
                            {allTracks.length === 0 && (
                                <AppText className="text-secondary-text text-sm">
                                    No songs added yet.
                                </AppText>
                            )}
                            {allTracks.map((track: any) => (
                                <Pressable
                                    key={track.id}
                                    onPress={() => {
                                        router.push({
                                            pathname: "/library/song",
                                            params: { id: track.id },
                                        });
                                    }}
                                    style={{ width: 140 }}
                                >
                                    <View
                                        className="w-full bg-secondary rounded-xl overflow-hidden items-center justify-center"
                                        style={{ aspectRatio: 1 }}
                                    >
                                        {track.cover_url ||
                                        track.albumCoverUrl ? (
                                            <Image
                                                source={{
                                                    uri:
                                                        track.cover_url ||
                                                        track.albumCoverUrl,
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            />
                                        ) : (
                                            <SymbolView
                                                name="music.note"
                                                size={40}
                                                tintColor={secondaryText}
                                            />
                                        )}
                                    </View>
                                    <AppText
                                        className="text-primary-text font-medium mt-2 text-sm"
                                        numberOfLines={1}
                                    >
                                        {track.title}
                                    </AppText>
                                    <AppText className="text-secondary-text text-xs">
                                        Song
                                    </AppText>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Discography Section */}
                    <View className="mb-6">
                        <AppText className="text-lg font-bold text-primary-text mb-3">
                            Discography
                        </AppText>

                        {artist.albums?.length === 0 ? (
                            <AppText className="text-secondary-text text-sm">
                                No albums added yet.
                            </AppText>
                        ) : (
                            <FlashList
                                data={artist.albums || []}
                                numColumns={2}
                                scrollEnabled={false}
                                keyExtractor={(item: any) => item.id.toString()}
                                renderItem={({
                                    item: album,
                                }: {
                                    item: any;
                                }) => (
                                    <View className="flex-1 m-1">
                                        <Host matchContents>
                                            <ContextMenu>
                                                <ContextMenu.Trigger>
                                                    <Pressable
                                                        onPress={() =>
                                                            handleSongPress(
                                                                album,
                                                            )
                                                        }
                                                    >
                                                        {album.cover_url ? (
                                                            <Image
                                                                source={{
                                                                    uri: album.cover_url,
                                                                }}
                                                                style={{
                                                                    width: "100%",
                                                                    aspectRatio: 1,
                                                                    borderRadius: 12,
                                                                }}
                                                            />
                                                        ) : (
                                                            <View
                                                                style={{
                                                                    width: "100%",
                                                                    aspectRatio: 1,
                                                                    borderRadius: 12,
                                                                    backgroundColor:
                                                                        "#E5E5E5",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                <SymbolView
                                                                    name="music.note.list"
                                                                    size={40}
                                                                    tintColor={
                                                                        secondaryText
                                                                    }
                                                                />
                                                            </View>
                                                        )}
                                                    </Pressable>
                                                </ContextMenu.Trigger>
                                                <ContextMenu.Items>
                                                    <Button
                                                        label="Play"
                                                        systemImage="play.fill"
                                                    />
                                                    <Button
                                                        label="Save"
                                                        systemImage="bookmark"
                                                        onPress={() => {}}
                                                    />
                                                    <Button
                                                        label="Open"
                                                        systemImage="arrow.up.right"
                                                    />
                                                </ContextMenu.Items>
                                            </ContextMenu>
                                        </Host>
                                        <PressableOpacity
                                            onPress={() =>
                                                handleSongPress(album)
                                            }
                                        >
                                            <AppText
                                                className="text-primary-text mt-2"
                                                weight="medium"
                                                numberOfLines={1}
                                            >
                                                {album.title}
                                            </AppText>
                                        </PressableOpacity>
                                        <AppText
                                            className="text-secondary-text"
                                            size="xs"
                                        >
                                            Album
                                        </AppText>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
    );
}
