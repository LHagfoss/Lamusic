import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { Appearance, View, ActivityIndicator } from "react-native";
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
    AppKilledPlaybackBehavior,
    IOSCategory,
    IOSCategoryMode,
} from "react-native-track-player";
import { PlaybackService } from "../services/playbackService";
import { usePlayerStore } from "../lib/playerStore";
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
    const { position, duration } = useProgress(500); // 500ms sync
    const track = useActiveTrack();
    const setPlaybackState = usePlayerStore(s => s.setPlaybackState);
    const setProgress = usePlayerStore(s => s.setProgress);
    const setCurrentTrack = usePlayerStore(s => s.setCurrentTrack);

    useEffect(() => {
        if (state) setPlaybackState(state as any);
    }, [state]);

    useEffect(() => {
        setProgress(position, duration);
    }, [position, duration]);

    useEffect(() => {
        if (track?.id) {
            setCurrentTrack(track.id);
        }
    }, [track?.id]);

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
                appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
            },
        });
        isPlayerInitialized = true;
    } catch (e) {
        if ((e as any).code === 'player_already_initialized') {
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
    const lastTargetRef = useRef<string | null>(null);
    const isNavigatingRef = useRef(false);

    useEffect(() => {
        setupPlayer();
    }, []);

    useEffect(() => {
        if (!initialized) return;
        
        SplashScreen.hideAsync();

        const inAuthGroup = segments[0] === "login";
        const isIndex = segments.length === 0 || segments[0] === "index";

        console.log(`[Nav Check] Session: ${!!session}, inAuth: ${inAuthGroup}, isIndex: ${isIndex}, Segments: ${segments}`);

        let targetRoute: string | null = null;

        if (!session) {
            if (!inAuthGroup) {
                targetRoute = "/login";
            }
        } else {
            if (inAuthGroup || isIndex) {
                targetRoute = "/(tabs)/library";
            }
        }

        if (targetRoute) {
            const currentPath = `/${segments.join("/")}`.replace(/\(|\)/g, "").replace(/^\/+/, "/").replace(/\/+$/, "");
            const cleanTarget = targetRoute.replace(/\(|\)/g, "").replace(/^\/+/, "/").replace(/\/+$/, "");
            
            const isAlreadyThere = currentPath === cleanTarget || (currentPath === "" && cleanTarget === "index");

            if (!isAlreadyThere && targetRoute !== lastTargetRef.current) {
                console.log(`[Nav] Executing: ${currentPath} -> ${targetRoute}`);
                lastTargetRef.current = targetRoute;
                
                // Small delay to ensure navigation container is ready
                const timer = setTimeout(() => {
                    router.replace(targetRoute as any);
                }, 1);
                return () => clearTimeout(timer);
            }
        } else {
            lastTargetRef.current = null;
        }
    }, [session, initialized, segments]);

    if (!initialized) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log(`[Auth] Event: ${_event}, User: ${session?.user?.email ?? "None"}`);
            setSession(session);
        });

        // 3. Handle Deep Links
        const handleDeepLink = async (url: string) => {
            console.log("[Auth] Deep Link Received:", url);
            const fragment = url.split("#")[1];
            if (fragment) {
                const params = fragment.split("&").reduce((acc, part) => {
                    const [key, value] = part.split("=");
                    acc[key] = value;
                    return acc;
                }, {} as Record<string, string>);

                const { access_token, refresh_token } = params;
                if (access_token && refresh_token) {
                    console.log("[Auth] Manually setting session from deep link...");
                    await supabase.auth.setSession({ access_token, refresh_token });
                }
            }
        };

        const linkSub = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));
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

export default function RootLayout() {
    Appearance.setColorScheme("light");

    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <KeyboardProvider>
                    <QueryClientProvider client={queryClient}>
                        <AuthWrapper>
                            <NavigationLogic>
                                <PlayerSync />
                                <Stack screenOptions={{ headerShown: false }}>
                                    <Stack.Screen name="index" options={{ headerShown: false }} />
                                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                    <Stack.Screen name="login" options={{ headerShown: false, gestureEnabled: false }} />
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
