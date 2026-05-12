import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/src/lib/authStore";

export default function Index() {
    const { session, initialized } = useAuthStore();

    if (!initialized) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Redirect href={session ? "/(tabs)/library" : "/login"} />;
}
