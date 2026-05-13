import { LegendList } from "@legendapp/list";
import { ArrowRight } from "lucide-react-native";
import { PressableScale } from "pressto";
import React from "react";
import {
    RefreshControl,
    ScrollView,
    View,
} from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText, ArtistCard, ArtistCardSkeleton, GreetingCard, SongCard, SongCardSkeleton } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";

export default function HomeScreen() {
    const primaryColor = String(useCSSVariable("--color-primary"));
    const { useRecentSongs, useArtists, useLibrary } = useMusic();

    const {
        data: recentSongs,
        isLoading: loadingSongs,
        refetch: refetchSongs,
    } = useRecentSongs();
    const {
        data: artists,
        isLoading: loadingArtists,
        refetch: refetchArtists,
    } = useArtists();
    const { refetch: refetchLibrary } = useLibrary();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetchSongs(), refetchArtists(), refetchLibrary()]);
        setRefreshing(false);
    }, [refetchSongs, refetchArtists, refetchLibrary]);

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
            <GreetingCard />

            <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2 px-4">
                    <AppText className="text-lg font-bold">
                        Latest Added
                    </AppText>

                    <PressableScale>
                        <View className="flex-row items-center gap-1">
                            <AppText
                                size="sm"
                                className="text-primary font-bold"
                            >
                                View more
                            </AppText>
                            <ArrowRight size={16} color={primaryColor} />
                        </View>
                    </PressableScale>
                </View>

                {loadingSongs ? (
                    <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16 }}>
                        {[0, 1, 2, 3].map((i) => (
                            <SongCardSkeleton key={i} delay={i * 80} />
                        ))}
                    </View>
                ) : !recentSongs || recentSongs.length === 0 ? (
                    <View className="p-4">
                        <AppText className="text-secondary-text">
                            No songs added yet.
                        </AppText>
                    </View>
                ) : (
                    <LegendList
                        data={recentSongs || []}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => (
                            <View style={{ width: 12 }} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        recycleItems
                        renderItem={({ item }) => <SongCard item={item} />}
                    />
                )}
            </View>

            <View className="mb-10">
                <View className="flex-row justify-between items-center mb-4 px-4">
                    <AppText className="text-lg font-bold">All Artists</AppText>
                </View>

                {loadingArtists ? (
                    <View style={{ flexDirection: "row", gap: 16, paddingHorizontal: 16 }}>
                        {[0, 1, 2, 3].map((i) => (
                            <ArtistCardSkeleton key={i} delay={i * 80} />
                        ))}
                    </View>
                ) : !artists || artists.length === 0 ? (
                    <View className="p-4">
                        <AppText className="text-secondary-text">
                            No artists added yet.
                        </AppText>
                    </View>
                ) : (
                    <LegendList
                        data={artists || []}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => (
                            <View style={{ width: 16 }} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        recycleItems
                        renderItem={({ item }) => <ArtistCard item={item} />}
                    />
                )}
            </View>
        </ScrollView>
    );
}
