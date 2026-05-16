import { useRouter } from "expo-router";
import React from "react";
import { ArtistStep } from "@/src/components/upload/ArtistStep";
import { useUploadStore } from "@/src/lib/uploadStore";

export default function ArtistSelectionScreen() {
    const { setArtist } = useUploadStore();
    const router = useRouter();

    return (
        <ArtistStep
            onSelect={(artist) => {
                setArtist(artist);
                router.navigate("/news/album");
            }}
            onBack={() => router.back()}
        />
    );
}
