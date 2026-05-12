import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableOpacity } from "pressto";
import { Pressable, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { usePlayerStore } from "@/src/lib/playerStore";
import { AppText } from "./AppText";

export function SongCard({ item }: { item: any }) {
    const router = useRouter();
    const playTrack = usePlayerStore((s) => s.playTrack);
    const addToQueue = usePlayerStore((s) => s.addToQueue);
    const playNext = usePlayerStore((s) => s.playNext);
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    function handlePlay() {
        playTrack({
            id: item.id,
            title: item.title,
            artist: item.artists?.name,
            cover: { uri: item.cover_url || item.albums?.cover_url },
            url: item.audio_url,
            duration: item.duration,
        });
    }

    function handleAddToQueue() {
        addToQueue({
            id: item.id,
            title: item.title,
            artist: item.artists?.name,
            cover: { uri: item.cover_url || item.albums?.cover_url },
            url: item.audio_url,
            duration: item.duration,
        });
    }

    function handlePlayNext() {
        playNext({
            id: item.id,
            title: item.title,
            artist: item.artists?.name,
            cover: { uri: item.cover_url || item.albums?.cover_url },
            url: item.audio_url,
            duration: item.duration,
        });
    }

    function handleOpen() {
        router.push({ pathname: "/library/song", params: { id: item.id } });
    }

    function handleOpenArtist() {
        router.push({
            pathname: "/library/artist",
            params: { name: item.artists?.name },
        });
    }

    return (
        <View style={{ width: 168 }}>
            <Host matchContents>
                <ContextMenu>
                    <ContextMenu.Trigger>
                        <View style={{ width: 168 }}>
                            <Pressable onPress={handleOpen}>
                                {(item.cover_url || item.albums?.cover_url) ? (
                                    <Image
                                        source={{ uri: item.cover_url || item.albums.cover_url }}
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
                                            backgroundColor: "#E5E5E5",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <SymbolView
                                            name="music.note"
                                            size={40}
                                            tintColor={secondaryText}
                                        />
                                    </View>
                                )}
                            </Pressable>
                        </View>
                    </ContextMenu.Trigger>
                    <ContextMenu.Items>
                        <Button
                            label="Play"
                            systemImage="play.fill"
                            onPress={handlePlay}
                        />
                        <Button
                            label="Add to Queue"
                            systemImage="plus"
                            onPress={handleAddToQueue}
                        />
                        <Button
                            label="Play Next"
                            systemImage="forward.end.fill"
                            onPress={handlePlayNext}
                        />
                        <Button
                            label="Save"
                            systemImage="bookmark"
                            onPress={() => {}}
                        />
                        <Button
                            label="Open"
                            systemImage="arrow.up.right"
                            onPress={handleOpen}
                        />
                    </ContextMenu.Items>
                </ContextMenu>
            </Host>

            <PressableOpacity
                onPress={handleOpen}
                style={{ flex: 1, marginTop: 4 }}
            >
                <AppText
                    className="flex-1 text-primary-text"
                    weight="medium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.title}
                </AppText>
            </PressableOpacity>
            <PressableOpacity onPress={handleOpenArtist}>
                <AppText
                    className="text-secondary-text"
                    size="xs"
                    numberOfLines={1}
                >
                    {item.artists?.name}
                </AppText>
            </PressableOpacity>
        </View>
    );
}
