import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CachedTrack {
    songId: string;
    localPath: string;
    sizeBytes: number;
    cachedAt: number;
    lastAccessedAt: number;
}

interface CacheStore {
    cache: Record<string, CachedTrack>;
    totalBytes: number;

    getCachedPath: (songId: string) => string | null;
    setCached: (entry: CachedTrack) => void;
    removeCached: (songId: string) => void;
    touchAccessed: (songId: string) => void;
    clearAll: () => void;
}

export const useCacheStore = create<CacheStore>()(
    persist(
        (set, get) => ({
            cache: {},
            totalBytes: 0,

            getCachedPath: (songId) => get().cache[songId]?.localPath ?? null,

            setCached: (entry) => {
                set((s) => {
                    const prev = s.cache[entry.songId];
                    const prevSize = prev?.sizeBytes ?? 0;
                    return {
                        cache: { ...s.cache, [entry.songId]: entry },
                        totalBytes: s.totalBytes - prevSize + entry.sizeBytes,
                    };
                });
            },

            removeCached: (songId) => {
                set((s) => {
                    const entry = s.cache[songId];
                    if (!entry) return s;
                    const { [songId]: _, ...rest } = s.cache;
                    return { cache: rest, totalBytes: s.totalBytes - entry.sizeBytes };
                });
            },

            touchAccessed: (songId) => {
                set((s) => {
                    const entry = s.cache[songId];
                    if (!entry) return s;
                    return {
                        cache: { ...s.cache, [songId]: { ...entry, lastAccessedAt: Date.now() } },
                    };
                });
            },

            clearAll: () => set({ cache: {}, totalBytes: 0 }),
        }),
        {
            name: "song-cache",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
