import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { AlbumStep } from "@/src/components/upload/AlbumStep";
import { useUploadStore } from "@/src/lib/uploadStore";

export default function AlbumSelectionScreen() {
    const { artist, setAlbum } = useUploadStore();
    const router = useRouter();

    if (!artist) {
        return null;
    }

    return (
        <AlbumStep
            artistId={artist.id}
            artistName={artist.name}
            onSelect={(album) => {
                setAlbum(album);
                router.navigate("/library/upload/review");
            }}
            onBack={() => router.back()}
        />
    );
}
