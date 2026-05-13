import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
    useAnimatedStyle,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

interface SkeletonBoxProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    delay?: number;
}

export function SkeletonBox({
    width,
    height = 16,
    borderRadius = 6,
    delay = 0,
}: SkeletonBoxProps) {
    const secondary = String(useCSSVariable("--color-secondary"));
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(0.35, { duration: 700 }),
                    withTiming(1, { duration: 700 }),
                ),
                -1,
            ),
        );
    }, []);

    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: secondary,
                },
                style,
            ]}
        />
    );
}

/* ─── SongCard skeleton (width: 168, aspectRatio 1 image) ─── */
export function SongCardSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <View style={{ width: 168 }}>
            <SkeletonBox
                width={168}
                height={168}
                borderRadius={12}
                delay={delay}
            />
            <View style={{ marginTop: 6 }}>
                <SkeletonBox width={110} height={13} borderRadius={5} delay={delay + 60} />
            </View>
            <View style={{ marginTop: 4 }}>
                <SkeletonBox width={76} height={11} borderRadius={4} delay={delay + 120} />
            </View>
        </View>
    );
}

/* ─── ArtistCard skeleton (width: 110, circle) ─── */
export function ArtistCardSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <View style={{ width: 110, alignItems: "center" }}>
            <SkeletonBox
                width={110}
                height={110}
                borderRadius={55}
                delay={delay}
            />
            <View style={{ marginTop: 8 }}>
                <SkeletonBox width={70} height={12} borderRadius={5} delay={delay + 60} />
            </View>
        </View>
    );
}

/* ─── Row skeleton (matches SavedRow) ─── */
export function RowSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 16,
            }}
        >
            <SkeletonBox width={48} height={48} borderRadius={8} delay={delay} />
            <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
                <SkeletonBox width="65%" height={14} borderRadius={5} delay={delay + 60} />
                <SkeletonBox width="42%" height={12} borderRadius={4} delay={delay + 120} />
            </View>
            <SkeletonBox width={36} height={12} borderRadius={4} delay={delay + 60} />
        </View>
    );
}

/* ─── Full-page skeletons ─── */

export function ArtistPageSkeleton() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            {/* Hero image */}
            <SkeletonBox width="100%" height={220} borderRadius={24} delay={0} />
            {/* Name + plays */}
            <View style={{ marginTop: 24, gap: 8 }}>
                <SkeletonBox width="55%" height={28} borderRadius={7} delay={60} />
                <SkeletonBox width="30%" height={14} borderRadius={5} delay={120} />
            </View>
            {/* Section label */}
            <View style={{ marginTop: 24 }}>
                <SkeletonBox width={80} height={18} borderRadius={5} delay={180} />
            </View>
            {/* Horizontal song cards */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                {[0, 1, 2].map((i) => (
                    <SongCardSkeleton key={i} delay={i * 80} />
                ))}
            </View>
            {/* Discography label */}
            <View style={{ marginTop: 24 }}>
                <SkeletonBox width={110} height={18} borderRadius={5} delay={240} />
            </View>
            {/* Album grid */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                {[0, 1].map((i) => (
                    <View key={i} style={{ flex: 1, gap: 6 }}>
                        <SkeletonBox width="100%" height={160} borderRadius={12} delay={i * 80} />
                        <SkeletonBox width="70%" height={13} borderRadius={5} delay={i * 80 + 60} />
                    </View>
                ))}
            </View>
        </View>
    );
}

export function AlbumPageSkeleton() {
    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ alignItems: "center", paddingHorizontal: 32, paddingTop: 16, paddingBottom: 24, gap: 10 }}>
                <SkeletonBox width={224} height={224} borderRadius={16} delay={0} />
                <SkeletonBox width="60%" height={22} borderRadius={6} delay={60} />
                <SkeletonBox width="35%" height={15} borderRadius={5} delay={120} />
                <SkeletonBox width="45%" height={13} borderRadius={4} delay={180} />
            </View>
            {/* Track rows */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <RowSkeleton key={i} delay={i * 50} />
            ))}
        </View>
    );
}

export function SongPageSkeleton() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: "row" }}>
                <SkeletonBox width={208} height={208} borderRadius={16} delay={0} />
                <View style={{ flex: 1, paddingLeft: 16, paddingTop: 4, gap: 8 }}>
                    <SkeletonBox width="90%" height={22} borderRadius={6} delay={60} />
                    <SkeletonBox width="65%" height={15} borderRadius={5} delay={120} />
                    <SkeletonBox width="40%" height={12} borderRadius={4} delay={180} />
                </View>
            </View>
            <View style={{ marginTop: 24 }}>
                <SkeletonBox width={140} height={18} borderRadius={5} delay={240} />
            </View>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                {[0, 1, 2].map((i) => (
                    <SongCardSkeleton key={i} delay={i * 80} />
                ))}
            </View>
        </View>
    );
}

export function ListPageSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <View style={{ flex: 1 }}>
            {Array.from({ length: rows }).map((_, i) => (
                <RowSkeleton key={i} delay={i * 40} />
            ))}
        </View>
    );
}
