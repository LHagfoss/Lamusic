import React, { useState } from "react";
import { View, Image } from "react-native";
import { SymbolView } from "expo-symbols";
import { useCSSVariable } from "uniwind";
import { AppButton, AppText, SettingsGroup } from "@/src/components";
import { useMusic } from "@/src/hooks/useMusic";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";

interface ReviewStepProps {
    file: DocumentPicker.DocumentPickerAsset;
    title: string;
    artist: { id: string; name: string };
    album: { id: string; title: string; coverUrl?: string };
    onBack: () => void;
}

export function ReviewStep({ file, title, artist, album, onBack }: ReviewStepProps) {
    const { uploadAudio, useCreateSong } = useMusic();
    const createSongMutation = useCreateSong();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const primaryText = String(useCSSVariable("--color-primary-text"));
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    async function handleUpload() {
        setIsUploading(true);
        try {
            // 1. Upload audio to storage
            const audioUrl = await uploadAudio(file.uri, file.name);
            
            // 2. Create song record in DB
            await createSongMutation.mutateAsync({
                title,
                audioUrl,
                artistId: artist.id,
                albumId: album.id,
                duration: 0, // In a real app, we'd extract this
            });

            alert("Song uploaded successfully!");
            router.replace("/(tabs)/library");
        } catch (error) {
            console.error(error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <View className="flex-1 mt-4 px-4">
            <AppText className="text-xl mb-6" weight="bold">Review & Upload</AppText>

            <View className="items-center mb-8">
                <View className="w-48 h-48 rounded-3xl bg-secondary overflow-hidden shadow-sm items-center justify-center">
                    {album.coverUrl ? (
                        <Image source={{ uri: album.coverUrl }} className="w-full h-full" />
                    ) : (
                        <SymbolView name="music.note.list" size={60} tintColor={secondaryText} />
                    )}
                </View>
                <AppText className="text-2xl mt-4 text-center" weight="bold">{title}</AppText>
                <AppText className="text-secondary-text text-lg">{artist.name}</AppText>
            </View>

            <SettingsGroup title="Details">
                <View className="p-4 flex-row justify-between">
                    <AppText className="text-secondary-text">Album</AppText>
                    <AppText weight="medium">{album.title}</AppText>
                </View>
                <View className="p-4 flex-row justify-between">
                    <AppText className="text-secondary-text">File Name</AppText>
                    <AppText weight="medium" numberOfLines={1} className="flex-1 text-right ml-4">
                        {file.name}
                    </AppText>
                </View>
            </SettingsGroup>

            <View className="mt-auto mb-8 gap-y-3">
                <AppButton 
                    title={isUploading ? "Uploading..." : "Upload Track"} 
                    fill 
                    disabled={isUploading}
                    loading={isUploading}
                    onPress={handleUpload} 
                />
                {!isUploading && <AppButton title="Back" onPress={onBack} />}
            </View>
        </View>
    );
}
