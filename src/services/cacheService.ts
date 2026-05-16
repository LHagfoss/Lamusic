import * as FileSystem from "expo-file-system/legacy";
import * as Network from "expo-network";
import { useCacheStore } from "../lib/cacheStore";
import type { Track } from "../lib/playerStore";

const CACHE_DIR = FileSystem.documentDirectory + "song-cache/";
const MAX_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB

async function ensureDir() {
    const info = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
}

async function isOnWifi(): Promise<boolean> {
    try {
        const state = await Network.getNetworkStateAsync();
        return state.type === Network.NetworkStateType.WIFI;
    } catch {
        return false;
    }
}

async function evictLRU(neededBytes: number) {
    const store = useCacheStore.getState();
    if (store.totalBytes + neededBytes <= MAX_BYTES) return;

    const entries = Object.values(store.cache).sort(
        (a, b) => a.lastAccessedAt - b.lastAccessedAt,
    );

    for (const entry of entries) {
        if (store.totalBytes + neededBytes <= MAX_BYTES) break;
        await FileSystem.deleteAsync(entry.localPath, { idempotent: true });
        useCacheStore.getState().removeCached(entry.songId);
    }
}

export const cacheService = {
    async cacheSong(track: Track): Promise<void> {
        if (!track.url || !track.id) return;
        const songId = track.id.toString();

        if (useCacheStore.getState().getCachedPath(songId)) {
            useCacheStore.getState().touchAccessed(songId);
            return;
        }

        if (!(await isOnWifi())) return;

        const localPath = CACHE_DIR + songId + ".mp3";

        // Recover if file exists but store is stale (reinstall etc.)
        const existing = await FileSystem.getInfoAsync(localPath, { size: true });
        if (existing.exists) {
            useCacheStore.getState().setCached({
                songId,
                localPath,
                sizeBytes: (existing as any).size ?? 0,
                cachedAt: Date.now(),
                lastAccessedAt: Date.now(),
            });
            return;
        }

        await evictLRU(10 * 1024 * 1024); // estimate 10 MB before knowing real size
        await ensureDir();

        try {
            await FileSystem.downloadAsync(track.url, localPath);
            const info = await FileSystem.getInfoAsync(localPath, { size: true });
            useCacheStore.getState().setCached({
                songId,
                localPath,
                sizeBytes: (info as any).size ?? 0,
                cachedAt: Date.now(),
                lastAccessedAt: Date.now(),
            });
        } catch {
            // Silently discard — bad URL, no internet, etc.
            await FileSystem.deleteAsync(localPath, { idempotent: true });
        }
    },

    async clearAll(): Promise<void> {
        try {
            await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
        } catch {}
        useCacheStore.getState().clearAll();
    },

    getCachedPath(songId: string): string | null {
        return useCacheStore.getState().getCachedPath(songId);
    },
};
