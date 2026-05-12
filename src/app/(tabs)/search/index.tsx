import { LegendList } from "@legendapp/list";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText, AppDivider } from "@/src/components";
import { usePlayerStore } from "@/src/lib/playerStore";
import { searchTracks, type JamendoTrack } from "@/src/services/jamendoService";

const GENRES = [
    "Rock", "Electronic", "Jazz", "Pop",
    "Classical", "Hip-Hop", "Ambient", "Folk",
    "Metal", "R&B", "Reggae", "Country",
] as const;

function formatDuration(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function SearchScreen() {
    const router = useRouter();
    const playTrack = usePlayerStore((s) => s.playTrack);
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<JamendoTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const tracks = await searchTracks(query.trim());
                setResults(tracks);
            } catch {
                setError("Search failed. Check connection.");
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    function handlePlay(track: JamendoTrack) {
        playTrack({
            id: track.id,
            title: track.name,
            artist: track.artist_name,
            cover: { uri: track.album_image || track.image },
            url: track.audio,
            duration: track.duration,
        });
        // TODO: log play_history to Supabase
        router.push("/player");
    }

    const showBrowse = !query.trim() && !loading;
    const showNoResults = query.trim() && !loading && results.length === 0 && !error;

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
                {/* Loading */}
                {loading && (
                    <View className="items-center pt-20">
                        <ActivityIndicator size="large" />
                    </View>
                )}

                {/* Browse genres */}
                {showBrowse && (
                    <View className="px-4 pt-4">
                        <AppText className="text-lg font-bold text-primary-text mb-3">
                            Browse
                        </AppText>
                        <View className="flex-row flex-wrap gap-2">
                            {GENRES.map((genre) => (
                                <Pressable
                                    key={genre}
                                    onPress={() => setQuery(genre)}
                                    style={({ pressed }) => ({
                                        opacity: pressed ? 0.7 : 1,
                                        backgroundColor: "#F2F2F7",
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 20,
                                    })}
                                >
                                    <AppText className="text-primary-text font-medium">
                                        {genre}
                                    </AppText>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* No results */}
                {showNoResults && (
                    <View className="items-center pt-20 gap-3">
                        <SymbolView
                            name="magnifyingglass"
                            size={40}
                            tintColor={secondaryText}
                        />
                        <AppText className="text-secondary-text">
                            No results for "{query}"
                        </AppText>
                    </View>
                )}

                {/* Error */}
                {error && !loading && (
                    <View className="items-center pt-20">
                        <AppText className="text-secondary-text">{error}</AppText>
                    </View>
                )}

                {/* Results */}
                {!loading && results.length > 0 && (
                    <LegendList
                        data={results}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <AppDivider />}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => handlePlay(item)}
                                style={({ pressed }) => ({
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 10,
                                    paddingHorizontal: 16,
                                    backgroundColor: pressed
                                        ? "rgba(0,0,0,0.05)"
                                        : "transparent",
                                })}
                            >
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 8,
                                        backgroundColor: "#E5E5E5",
                                        overflow: "hidden",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.album_image || item.image ? (
                                        <Image
                                            source={{
                                                uri: item.album_image || item.image,
                                            }}
                                            style={{ width: "100%", height: "100%" }}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <SymbolView
                                            name="music.note"
                                            size={20}
                                            tintColor={secondaryText}
                                        />
                                    )}
                                </View>

                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <AppText
                                        className="text-primary-text font-medium"
                                        numberOfLines={1}
                                    >
                                        {item.name}
                                    </AppText>
                                    <AppText
                                        className="text-secondary-text text-sm"
                                        numberOfLines={1}
                                    >
                                        {item.artist_name}
                                        {item.album_name ? ` · ${item.album_name}` : ""}
                                    </AppText>
                                </View>

                                <AppText className="text-secondary-text text-sm ml-4">
                                    {formatDuration(item.duration)}
                                </AppText>
                            </Pressable>
                        )}
                    />
                )}
            </ScrollView>
        </>
    );
}
