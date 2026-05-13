import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppButton, AppText, SettingsGroup } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";
import { useUploadStore } from "@/src/lib/uploadStore";

export default function ReviewScreen() {
    const { file, title, duration, artist, album, coverUri, reset } =
        useUploadStore();
    const { uploadAudio, uploadImage, useCreateSong } = useMusic();
    const createSongMutation = useCreateSong();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    function formatDuration(s: number) {
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    }

    async function handleUpload() {
        if (!file || !artist || !album) return;
        setIsUploading(true);
        try {
            // 1. Upload audio to storage
            const audioUrl = await uploadAudio(file.uri, file.name);

            // 2. Upload cover if exists
            let coverUrl = null;
            if (coverUri) {
                coverUrl = await uploadImage(coverUri, `cover-${title}`);
            }

            // 3. Create song record in DB
            const songData = {
                title,
                audio_url: audioUrl,
                cover_url: coverUrl,
                artist_id: artist.id,
                album_id: album.id,
                duration: duration,
            };
            console.log(
                "Creating song with data:",
                JSON.stringify(songData, null, 2),
            );

            await createSongMutation.mutateAsync(songData);

            alert("Song uploaded successfully!");
            reset();
            router.replace("/(tabs)/library");
        } catch (error) {
            console.error(error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    if (!file || !artist || !album) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <AppText className="text-secondary-text">
                    Missing information. Please go back.
                </AppText>
                <AppButton
                    title="Go Back"
                    onPress={() => router.back()}
                    className="mt-4"
                />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16 }}
            contentInsetAdjustmentBehavior="automatic"
        >
            <View className="items-center mb-8">
                <View className="w-48 h-48 rounded-3xl bg-secondary overflow-hidden shadow-sm items-center justify-center">
                    {coverUri || album.coverUrl ? (
                        <Image
                            source={{ uri: coverUri || album.coverUrl }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                        />
                    ) : (
                        <SymbolView
                            name="music.note.list"
                            size={60}
                            tintColor={secondaryText}
                        />
                    )}
                </View>
                <AppText className="text-2xl mt-4 text-center" weight="bold">
                    {title}
                </AppText>
                <AppText className="text-secondary-text text-lg">
                    {artist.name}
                </AppText>
            </View>

            <SettingsGroup title="Details">
                <View className="p-4 flex-row justify-between">
                    <AppText className="text-secondary-text">Album</AppText>
                    <AppText weight="medium">{album.title}</AppText>
                </View>
                <View className="p-4 flex-row justify-between">
                    <AppText className="text-secondary-text">Duration</AppText>
                    <AppText weight="medium">
                        {formatDuration(duration)}
                    </AppText>
                </View>
                <View className="p-4 flex-row justify-between">
                    <AppText className="text-secondary-text">File Name</AppText>
                    <AppText
                        weight="medium"
                        numberOfLines={1}
                        className="flex-1 text-right ml-4"
                    >
                        {file.name}
                    </AppText>
                </View>
            </SettingsGroup>

            <View className="mt-auto mb-8">
                <AppButton
                    title={isUploading ? "Uploading..." : "Upload Track"}
                    fill
                    disabled={isUploading}
                    loading={isUploading}
                    onPress={handleUpload}
                />
            </View>
        </ScrollView>
    );
}
