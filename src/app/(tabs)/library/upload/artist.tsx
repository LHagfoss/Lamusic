import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ArtistStep } from "@/src/components/upload/ArtistStep";
import { useUploadStore } from "@/src/lib/uploadStore";

export default function ArtistSelectionScreen() {
    const { setArtist } = useUploadStore();
    const router = useRouter();

    return (
        <ArtistStep
            onSelect={(artist) => {
                setArtist(artist);
                router.navigate("/library/upload/album");
            }}
            onBack={() => router.back()}
        />
    );
}
