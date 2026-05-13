import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/src/lib/authStore";

export default function Index() {
    const { session, initialized } = useAuthStore();

    if (!initialized) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Redirect href={session ? "/(tabs)/library" : "/login"} />;
}
