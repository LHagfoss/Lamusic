import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer, { State, RepeatMode } from "react-native-track-player";

export interface Track {
    id: string | number;
    title: string;
    artist?: string;
    cover?: { uri: string };
    url?: string;
    duration?: number;
}

interface PlayerStore {
    currentTrack: Track | null;
    queue: Track[];
    currentIndex: number;
    isPlaying: boolean;
    position: number;
    duration: number;
    repeatMode: RepeatMode;
    listenedSeconds: number;
    hasCountedThisPlay: boolean;

    // Actions
    playTrack: (track: Track) => Promise<void>;
    playQueue: (tracks: Track[], startIndex: number) => Promise<void>;
    addToQueue: (track: Track) => Promise<void>;
    playNext: (track: Track) => Promise<void>;
    removeFromQueue: (index: number) => Promise<void>;
    clearQueue: () => Promise<void>;
    skipToIndex: (index: number) => Promise<void>;
    togglePlay: () => Promise<void>;
    skipToNext: () => Promise<void>;
    skipToPrevious: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
    setRepeatMode: (mode: RepeatMode) => Promise<void>;
    toggleRepeatMode: () => Promise<void>;
    addListenedSeconds: (seconds: number) => void;
    markPlayCounted: () => void;
    resetListenProgress: () => void;

    // State sync (internal)
    setPlaybackState: (state: State) => void;
    setProgress: (position: number, duration: number) => void;
    setCurrentTrack: (trackId: string) => void;
}

export const usePlayerStore = create<PlayerStore>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            queue: [],
            currentIndex: -1,
            isPlaying: false,
            position: 0,
            duration: 0,
            repeatMode: RepeatMode.Off,
            listenedSeconds: 0,
            hasCountedThisPlay: false,

            playTrack: async (track) => {
                const { playQueue } = get();
                await playQueue([track], 0);
            },

            playQueue: async (tracks, startIndex) => {
                if (tracks.length === 0) return;

                try {
                    await TrackPlayer.reset();
                    // Re-apply repeat mode — reset() clears native TrackPlayer state
                    await TrackPlayer.setRepeatMode(get().repeatMode);

                    const nativeTracks = tracks.map((t) => ({
                        id: t.id.toString(),
                        url: t.url!,
                        title: t.title,
                        artist: t.artist,
                        artwork: t.cover?.uri,
                        duration: t.duration,
                    }));

                    await TrackPlayer.add(nativeTracks);

                    if (startIndex > 0) {
                        await TrackPlayer.skip(startIndex);
                    }

                    await TrackPlayer.play();
                    set({
                        queue: tracks,
                        currentIndex: startIndex,
                        currentTrack: tracks[startIndex],
                        isPlaying: true,
                    });
                } catch (error) {
                    console.error("Error in playQueue:", error);
                }
            },

            addToQueue: async (track) => {
                const { queue } = get();
                try {
                    await TrackPlayer.add({
                        id: track.id.toString(),
                        url: track.url!,
                        title: track.title,
                        artist: track.artist,
                        artwork: track.cover?.uri,
                        duration: track.duration,
                    });
                    set({ queue: [...queue, track] });
                } catch (error) {
                    console.error("Error adding to queue:", error);
                }
            },

            playNext: async (track) => {
                const { queue, currentIndex } = get();
                const insertAt = currentIndex + 1;
                try {
                    await TrackPlayer.add(
                        {
                            id: track.id.toString(),
                            url: track.url!,
                            title: track.title,
                            artist: track.artist,
                            artwork: track.cover?.uri,
                            duration: track.duration,
                        },
                        insertAt,
                    );
                    const newQueue = [...queue];
                    newQueue.splice(insertAt, 0, track);
                    set({ queue: newQueue });
                } catch (error) {
                    console.error("Error in playNext:", error);
                }
            },

            removeFromQueue: async (index) => {
                const { queue, currentIndex } = get();
                try {
                    await TrackPlayer.remove(index);
                    const newQueue = [...queue];
                    newQueue.splice(index, 1);

                    let nextIndex = currentIndex;
                    if (index < currentIndex) {
                        nextIndex--;
                    } else if (index === currentIndex) {
                        // If we remove current track, TrackPlayer handles it, but we might need to update state
                        const current = await TrackPlayer.getActiveTrack();
                        const activeIndex =
                            await TrackPlayer.getActiveTrackIndex();
                        set({
                            currentIndex: activeIndex ?? -1,
                            currentTrack: newQueue[activeIndex ?? -1] || null,
                        });
                    }

                    set({ queue: newQueue, currentIndex: nextIndex });
                } catch (error) {
                    console.error("Error removing from queue:", error);
                }
            },

            clearQueue: async () => {
                try {
                    await TrackPlayer.reset();
                    set({
                        queue: [],
                        currentIndex: -1,
                        currentTrack: null,
                        isPlaying: false,
                    });
                } catch (error) {
                    console.error("Error clearing queue:", error);
                }
            },

            skipToIndex: async (index) => {
                try {
                    await TrackPlayer.skip(index);
                    await TrackPlayer.play();
                } catch (error) {
                    console.error("Error skipping to index:", error);
                }
            },

            togglePlay: async () => {
                try {
                    const state = await TrackPlayer.getPlaybackState();
                    if (state.state === State.Playing) {
                        await TrackPlayer.pause();
                    } else {
                        await TrackPlayer.play();
                    }
                } catch (error) {
                    console.error("Error in togglePlay:", error);
                }
            },

            skipToNext: async () => {
                try {
                    await TrackPlayer.skipToNext();
                } catch (error) {
                    // Probably at end of queue
                    console.log("No next track");
                }
            },

            skipToPrevious: async () => {
                try {
                    const position = await TrackPlayer.getPosition();
                    if (position > 3) {
                        await TrackPlayer.seekTo(0);
                    } else {
                        await TrackPlayer.skipToPrevious();
                    }
                } catch (error) {
                    // Probably at start of queue
                    await TrackPlayer.seekTo(0);
                    console.log("No previous track");
                }
            },

            seekTo: async (position) => {
                await TrackPlayer.seekTo(position);
                set({ position });
            },

            setRepeatMode: async (mode) => {
                await TrackPlayer.setRepeatMode(mode);
                set({ repeatMode: mode });
            },

            toggleRepeatMode: async () => {
                const { repeatMode } = get();
                let nextMode = RepeatMode.Off;
                if (repeatMode === RepeatMode.Off) nextMode = RepeatMode.Queue;
                else if (repeatMode === RepeatMode.Queue)
                    nextMode = RepeatMode.Track;
                else nextMode = RepeatMode.Off;

                await TrackPlayer.setRepeatMode(nextMode);
                set({ repeatMode: nextMode });
            },

            setPlaybackState: (state) => {
                set({ isPlaying: state === State.Playing });
            },

            setProgress: (position, duration) => {
                set({ position, duration });
            },

            setCurrentTrack: (trackId) => {
                const { queue } = get();
                const index = queue.findIndex(
                    (t) => t.id.toString() === trackId,
                );
                if (index !== -1) {
                    set({ currentIndex: index, currentTrack: queue[index] });
                }
            },

            addListenedSeconds: (seconds) => {
                set((s) => ({ listenedSeconds: s.listenedSeconds + seconds }));
            },

            markPlayCounted: () => {
                set({ hasCountedThisPlay: true });
            },

            resetListenProgress: () => {
                set({ listenedSeconds: 0, hasCountedThisPlay: false });
            },
        }),
        {
            name: "player-store",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ repeatMode: state.repeatMode }),
        },
    ),
);
