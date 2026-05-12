import type * as DocumentPicker from "expo-document-picker";
import { create } from "zustand";

interface UploadState {
    file: DocumentPicker.DocumentPickerAsset | null;
    coverUri: string | null;
    title: string;
    duration: number;
    artist: { id: string; name: string } | null;
    album: { id: string; title: string; coverUrl?: string } | null;

    setFile: (file: DocumentPicker.DocumentPickerAsset | null) => void;
    setCoverUri: (uri: string | null) => void;
    setTitle: (title: string) => void;
    setDuration: (duration: number) => void;
    setArtist: (artist: { id: string; name: string } | null) => void;
    setAlbum: (
        album: { id: string; title: string; coverUrl?: string } | null,
    ) => void;
    reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
    file: null,
    coverUri: null,
    title: "",
    duration: 0,
    artist: null,
    album: null,

    setFile: (file) => set({ file }),
    setCoverUri: (coverUri) => set({ coverUri }),
    setTitle: (title) => set({ title }),
    setDuration: (duration) => set({ duration }),
    setArtist: (artist) => set({ artist }),
    setAlbum: (album) => set({ album }),
    reset: () =>
        set({
            file: null,
            coverUri: null,
            title: "",
            duration: 0,
            artist: null,
            album: null,
        }),
}));
