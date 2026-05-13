import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../lib/authStore";
import TrackPlayer, {
    Capability,
    usePlaybackState,
    useProgress,
    useActiveTrack,
    State,
    RepeatMode,
    AppKilledPlaybackBehavior,
    IOSCategory,
    IOSCategoryMode,
} from "react-native-track-player";
import { StatusBar } from "expo-status-bar";
import { PlaybackService } from "../services/playbackService";
import { usePlayerStore } from "../lib/playerStore";
import { useThemeStore } from "../lib/themeStore";
import { musicService } from "../services/musicService";
import { useCSSVariable } from "uniwind";
import "../global.css";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Register playback service immediately at module level
TrackPlayer.registerPlaybackService(() => PlaybackService);

/**
 * Syncs the TrackPlayer native state with our Zustand playerStore
 */
function PlayerSync() {
    const { state } = usePlaybackState();
    const { position, duration } = useProgress(500);
    const track = useActiveTrack();
    const setPlaybackState = usePlayerStore((s) => s.setPlaybackState);
    const setProgress = usePlayerStore((s) => s.setProgress);
    const setCurrentTrack = usePlayerStore((s) => s.setCurrentTrack);
    const repeatMode = usePlayerStore((s) => s.repeatMode);
    const listenedSeconds = usePlayerStore((s) => s.listenedSeconds);
    const hasCountedThisPlay = usePlayerStore((s) => s.hasCountedThisPlay);
    const addListenedSeconds = usePlayerStore((s) => s.addListenedSeconds);
    const markPlayCounted = usePlayerStore((s) => s.markPlayCounted);
    const resetListenProgress = usePlayerStore((s) => s.resetListenProgress);
    const didLoopRef = useRef(false);
    const prevPositionRef = useRef(0);

    useEffect(() => {
        if (state) setPlaybackState(state as any);
    }, [state]);

    useEffect(() => {
        setProgress(position, duration);
    }, [position, duration]);

    useEffect(() => {
        if (track?.id) setCurrentTrack(track.id);
    }, [track?.id]);

    // Accumulate real listened time — ignore seeks (delta > 2s or negative)
    useEffect(() => {
        const delta = position - prevPositionRef.current;
        prevPositionRef.current = position;
        if (!hasCountedThisPlay && delta > 0 && delta < 2) {
            addListenedSeconds(delta);
        }
    }, [position]);

    // Check listen threshold: min(30s, 50% of duration)
    useEffect(() => {
        if (hasCountedThisPlay || duration === 0 || listenedSeconds === 0)
            return;
        const threshold = Math.min(30, duration * 0.5);
        if (listenedSeconds >= threshold && track?.id) {
            markPlayCounted();
            musicService.incrementPlayCount(track.id).catch(console.error);
        }
    }, [listenedSeconds, duration, hasCountedThisPlay, track?.id]);

    // Reset listen progress when track changes
    useEffect(() => {
        prevPositionRef.current = 0;
        resetListenProgress();
    }, [track?.id]);

    // Position-based repeat fallback — catches cases PlaybackQueueEnded misses
    useEffect(() => {
        if (repeatMode === RepeatMode.Off || duration === 0 || position === 0) {
            didLoopRef.current = false;
            return;
        }
        if (position / duration >= 0.98 && !didLoopRef.current) {
            didLoopRef.current = true;
            TrackPlayer.seekTo(0).then(() => TrackPlayer.play());
            setTimeout(() => {
                didLoopRef.current = false;
            }, 2000);
        }
    }, [position, duration, repeatMode]);

    return null;
}

/**
 * Initializes TrackPlayer once
 */
let isPlayerInitialized = false;

async function setupPlayer() {
    if (isPlayerInitialized) return;
    try {
        await TrackPlayer.setupPlayer({
            iosCategory: IOSCategory.Playback,
            iosCategoryMode: IOSCategoryMode.Default,
        });
        await TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
                Capability.SeekTo,
            ],
            compactCapabilities: [Capability.Play, Capability.Pause],
            notificationCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
                Capability.SeekTo,
            ],
            // Android specific
            android: {
                appKilledPlaybackBehavior:
                    AppKilledPlaybackBehavior.ContinuePlayback,
            },
        });
        isPlayerInitialized = true;
        await usePlayerStore.getState().restorePlayback();
    } catch (e) {
        if ((e as any).code === "player_already_initialized") {
            isPlayerInitialized = true;
        } else {
            console.log("TrackPlayer setup error:", e);
        }
    }
}

function NavigationLogic({ children }: { children: React.ReactNode }) {
    const { session, initialized } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        setupPlayer();
    }, []);

    useEffect(() => {
        if (!initialized) return;
        SplashScreen.hideAsync();

        const inAuthGroup = segments[0] === "login";
        const isIndex = segments.length === 0 || segments[0] === "index";

        // index.tsx handles initial routing — only intervene mid-session
        if (isIndex) return;

        // Logged-out user on protected route → kick to login
        if (!session && !inAuthGroup) {
            router.replace("/login");
        }

        // Logged-in user somehow on login → send to library
        if (session && inAuthGroup) {
            router.replace("/(tabs)/library");
        }
    }, [session, initialized, segments]);

    return <>{children}</>;
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { setSession, setInitialized } = useAuthStore();

    useEffect(() => {
        // 1. Initialize session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setInitialized(true);
        });

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log(
                `[Auth] Event: ${_event}, User: ${session?.user?.email ?? "None"}`,
            );
            setSession(session);
        });

        // 3. Handle Deep Links
        const handleDeepLink = async (url: string) => {
            console.log("[Auth] Deep Link Received:", url);
            const fragment = url.split("#")[1];
            if (fragment) {
                const params = fragment.split("&").reduce(
                    (acc, part) => {
                        const [key, value] = part.split("=");
                        acc[key] = value;
                        return acc;
                    },
                    {} as Record<string, string>,
                );

                const { access_token, refresh_token } = params;
                if (access_token && refresh_token) {
                    console.log(
                        "[Auth] Manually setting session from deep link...",
                    );
                    await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });
                }
            }
        };

        const linkSub = Linking.addEventListener("url", ({ url }) =>
            handleDeepLink(url),
        );
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });

        return () => {
            subscription.unsubscribe();
            linkSub.remove();
        };
    }, []);

    return <>{children}</>;
}

function ThemeApplier() {
    const isDark = useThemeStore((s) => s.isDark);
    return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function RootLayout() {
    const backgroundColor = String(useCSSVariable("--color-background"));

    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <KeyboardProvider>
                    <QueryClientProvider client={queryClient}>
                        <AuthWrapper>
                            <NavigationLogic>
                                <ThemeApplier />
                                <PlayerSync />
                                <Stack
                                    screenOptions={{
                                        headerShown: false,
                                        contentStyle: { backgroundColor },
                                    }}
                                >
                                    <Stack.Screen
                                        name="index"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(tabs)"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="login"
                                        options={{
                                            headerShown: false,
                                            gestureEnabled: false,
                                        }}
                                    />
                                    <Stack.Screen
                                        name="player"
                                        options={{
                                            headerShown: false,
                                            presentation: "formSheet",
                                            sheetAllowedDetents: [1.0],
                                            sheetInitialDetentIndex: 0,
                                            sheetGrabberVisible: true,
                                            sheetCornerRadius: 50,
                                        }}
                                    />
                                </Stack>
                            </NavigationLogic>
                        </AuthWrapper>
                    </QueryClientProvider>
                </KeyboardProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
