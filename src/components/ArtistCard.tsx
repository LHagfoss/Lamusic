import { Image } from "expo-image";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { PressableScale } from "pressto";
import { View } from "react-native";
import { useCSSVariable } from "uniwind";
import { AppText } from "./AppText";

export function ArtistCard({ item }: { item: any }) {
    const secondaryText = String(useCSSVariable("--color-secondary-text"));

    return (
        <Link
            asChild
            href={{
                pathname: "/library/artist",
                params: { name: item.name },
            }}
        >
            <Link.Trigger>
                <PressableScale style={{ width: 110, alignItems: "center" }}>
                    {item.image_url ? (
                        <Image
                            source={{ uri: item.image_url }}
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: 100,
                                marginBottom: 8,
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: 100,
                                marginBottom: 8,
                                backgroundColor: "#E5E5E5",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SymbolView
                                name="person.fill"
                                size={40}
                                tintColor={secondaryText}
                            />
                        </View>
                    )}

                    <AppText
                        weight="medium"
                        size="sm"
                        numberOfLines={1}
                        className="text-center text-primary-text"
                    >
                        {item.name}
                    </AppText>
                </PressableScale>
            </Link.Trigger>

            <Link.Preview>
                <View style={{ flex: 1, backgroundColor: "#1C1C1E" }}>
                    {item.image_url ? (
                        <Image
                            source={{ uri: item.image_url }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                        />
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SymbolView
                                name="person.fill"
                                size={80}
                                tintColor="#555"
                            />
                        </View>
                    )}
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: 16,
                            paddingBottom: 24,
                            backgroundColor: "rgba(0,0,0,0.45)",
                        }}
                    >
                        <AppText
                            weight="bold"
                            style={{ color: "#fff", fontSize: 22 }}
                            numberOfLines={1}
                        >
                            {item.name}
                        </AppText>
                        <AppText style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                            Artist
                        </AppText>
                    </View>
                </View>
            </Link.Preview>

            <Link.Menu>
                <Link.MenuAction title="Open" icon="arrow.up.right" />
                <Link.MenuAction title="Follow" icon="person.badge.plus" />
                <Link.MenuAction title="Share" icon="square.and.arrow.up" />
            </Link.Menu>
        </Link>
    );
}
