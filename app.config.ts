import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "lamusic",
    slug: "lamusic",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "lamusic",
    backgroundColor: "#E6F4FE",
    userInterfaceStyle: "light",
    ios: {
        icon: "./assets/music-icon.icon",
        bundleIdentifier: "com.lucas.lamusic",
    },
    android: {
        package: "com.lucas.lamusic",
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        predictiveBackGestureEnabled: false,
        permissions: [
            "android.permission.FOREGROUND_SERVICE",
            "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK"
        ]
    },
    web: {
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        "expo-dev-client",
        "expo-audio",
        [
            "expo-splash-screen",
            {
                backgroundColor: "#208AEF",
                android: {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 76,
                },
            },
        ],
        "@react-native-community/datetimepicker",
        "expo-font",
        "expo-image",
        "expo-web-browser",
        [
            "expo-build-properties",
            {
                "ios": {
                    "deploymentTarget": "15.1",
                    "infoPlist": {
                        "UIBackgroundModes": ["audio"]
                    }
                }
            }
        ]
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: false,
    },
});
