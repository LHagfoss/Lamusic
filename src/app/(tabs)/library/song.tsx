import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText } from "@/src/components/AppText";
import { SongPageSkeleton } from "@/src/components/Skeleton";
import { useMusic } from "@/src/hooks/useMusic";
import { usePlayerStore } from "@/src/lib/playerStore";
import { formatPlayCount } from "@/src/utils";

export default function SongScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [shuffleOn, setShuffleOn] = useState(false);

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));
    const onPrimaryText = String(useCSSVariable("--color-on-primary-text"));
    const _foreground = String(useCSSVariable("--color-foreground"));

    const playTrack = usePlayerStore((s) => s.playTrack);

    const { useLibrary, useToggleFavorite } = useMusic();
    const { data: library, isLoading } = useLibrary();
    const toggleFavoriteMutation = useToggleFavorite();

    const allTracks =
        library?.flatMap(
            (a: any) =>
                a.albums?.flatMap(
                    (al: any) =>
                        al.songs?.map((s: any) => ({
                            ...s,
                            artistName: a.name,
                            coverUrl: s.cover_url || al.cover_url,
                        })) || [],
                ) || [],
        ) || [];

    const track = allTracks.find((t: any) => t.id === id);
    const isLiked = track?.is_favorite ?? false;

    function formatDuration(s: number) {
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    }

    const handleToggleFavorite = async () => {
        if (!track?.id) return;
        try {
            await toggleFavoriteMutation.mutateAsync({
                songId: track.id.toString(),
                isFavorite: !isLiked,
            });
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    const moreTracks = track
        ? [...allTracks]
              .filter(
                  (t: any) =>
                      t.artist_id === track.artist_id && t.id !== track.id,
              )
              .slice(0, 6)
        : [];

    function handlePlaySongPress() {
        if (!track) return;
        playTrack({
            id: track.id,
            title: track.title,
            artist: track.artistName,
            cover: { uri: track.coverUrl },
            url: track.audio_url,
        });
    }

    if (isLoading) {
        return <SongPageSkeleton />;
    }

    if (!track) {
        return (
            <View className="flex-1 items-center justify-center">
                <AppText className="text-secondary-text">
                    Track not found
                </AppText>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
        >
            <Stack.Screen
                options={{
                    title: track.title,
                    unstable_headerRightItems: () => [
                        {
                            type: "button",
                            label: "Save",
                            icon: {
                                type: "sfSymbol",
                                name: isLiked ? "heart.fill" : "heart",
                            },
                            onPress: handleToggleFavorite,
                        },
                        {
                            type: "button",
                            label: "Queue",
                            icon: { type: "sfSymbol", name: "list.bullet" },
                            onPress: () => {},
                        },
                    ],
                }}
            />

            <View className="px-4 pt-4 flex-row">
                <View
                    className="w-52 bg-secondary rounded-2xl overflow-hidden mb-4 items-center justify-center"
                    style={{ aspectRatio: 1 }}
                >
                    {track.coverUrl ? (
                        <Image
                            source={{ uri: track.coverUrl }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    ) : (
                        <SymbolView
                            name="music.note"
                            size={60}
                            tintColor={secondaryText}
                        />
                    )}
                </View>

                <View className="px-4 pb-4 flex-1 justify-between">
                    <View>
                        <AppText
                            className="text-primary-text"
                            weight="bold"
                            size="2xl"
                            numberOfLines={2}
                        >
                            {track.title}
                        </AppText>

                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname: "/library/artist",
                                    params: { name: track.artistName },
                                })
                            }
                        >
                            <AppText className="text-secondary-text">
                                {track.artistName}{" "}
                                {track.duration
                                    ? `· ${formatDuration(track.duration)}`
                                    : ""}
                            </AppText>
                        </Pressable>
                        {(track.play_count ?? 0) > 0 && (
                            <AppText className="text-tertiary-text text-xs mt-1">
                                {formatPlayCount(track.play_count)} plays
                            </AppText>
                        )}
                    </View>

                    <GlassContainer
                        spacing={12}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Pressable
                            className="items-center gap-1"
                            onPress={() => setShuffleOn((v) => !v)}
                        >
                            <GlassView
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
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

                        <Pressable onPress={handlePlaySongPress}>
                            <GlassView
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                isInteractive
                            >
                                <SymbolView
                                    name="play.fill"
                                    size={22}
                                    tintColor={primaryText}
                                />
                            </GlassView>
                        </Pressable>
                    </GlassContainer>
                </View>
            </View>

            {moreTracks.length > 0 && (
                <View className="mt-6 mb-4">
                    <AppText className="text-lg font-bold text-primary-text mb-3 px-4">
                        More from {track.artistName}
                    </AppText>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            gap: 12,
                        }}
                    >
                        {moreTracks.map((t: any) => (
                            <Pressable
                                key={t.id}
                                style={{ width: 140 }}
                                onPress={() =>
                                    router.push({
                                        pathname: "/library/song",
                                        params: { id: t.id },
                                    })
                                }
                            >
                                <View
                                    className="w-full bg-secondary rounded-xl overflow-hidden items-center justify-center"
                                    style={{ aspectRatio: 1 }}
                                >
                                    {t.coverUrl ? (
                                        <Image
                                            source={{ uri: t.coverUrl }}
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
                                    {t.title}
                                </AppText>
                                <AppText className="text-secondary-text text-xs">
                                    Song
                                </AppText>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
        </ScrollView>
    );
}
