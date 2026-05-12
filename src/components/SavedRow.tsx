import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { ActionSheetIOS, Pressable, View } from "react-native";
import { AppText } from "./AppText";

type SavedItem = any;

function formatDuration(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

interface QueueActions {
    onPlayNext: () => void;
    onAddToQueue: () => void;
}

interface SavedRowProps {
    item: SavedItem;
    secondaryText: string;
    type: "Songs" | "Albums" | "Artists";
    onPress?: () => void;
    queueActions?: QueueActions;
}

export function SavedRow({
    item,
    secondaryText,
    type,
    onPress,
    queueActions,
}: SavedRowProps) {
    const isSong = type === "Songs";
    const isAlbum = type === "Albums";
    const isArtist = type === "Artists";

    const title = isArtist ? item.name : item.title;
    const cover = isArtist
        ? item.image_url
        : isAlbum
          ? item.cover_url
          : (item.cover_url || item.albums?.cover_url);

    let subtext = "";
    if (isSong) subtext = item.artists?.name || "";
    if (isAlbum)
        subtext = `${item.artists?.name || ""} · ${item.songs?.length || 0} songs`;
    if (isArtist)
        subtext = `${item.albums?.length || 0} ${item.albums?.length === 1 ? "album" : "albums"}`;

    function handleMorePress() {
        if (!queueActions) return;
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Play Next", "Add to Queue"],
                cancelButtonIndex: 0,
            },
            (index) => {
                if (index === 1) queueActions.onPlayNext();
                if (index === 2) queueActions.onAddToQueue();
            },
        );
    }

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 16,
                backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "transparent",
            })}
        >
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: isArtist ? 24 : 8,
                        backgroundColor: "#E5E5E5",
                        overflow: "hidden",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {cover ? (
                        <Image
                            source={{ uri: cover }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                        />
                    ) : (
                        <SymbolView
                            name={isArtist ? "person.fill" : "music.note"}
                            size={20}
                            tintColor={secondaryText}
                        />
                    )}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <AppText className="text-primary-text font-medium" numberOfLines={1}>
                        {title}
                    </AppText>
                    <AppText className="text-secondary-text text-sm" numberOfLines={1}>
                        {subtext}
                    </AppText>
                </View>

                {isSong && (
                    <AppText className="text-secondary-text text-sm">
                        {formatDuration(item.duration || 0)}
                    </AppText>
                )}

                {queueActions && isSong && (
                    <Pressable
                        onPress={handleMorePress}
                        hitSlop={8}
                        style={{ marginLeft: 12 }}
                    >
                        <SymbolView name="ellipsis" size={16} tintColor={secondaryText} />
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
}
