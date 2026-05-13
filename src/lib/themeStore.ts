import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeStore {
    isDark: boolean;
    toggle: () => void;
    setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            isDark: false,
            toggle: () => {
                const next = !get().isDark;
                Appearance.setColorScheme(next ? "dark" : "light");
                set({ isDark: next });
            },
            setDark: (dark) => {
                Appearance.setColorScheme(dark ? "dark" : "light");
                set({ isDark: dark });
            },
        }),
        {
            name: "theme-store",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    Appearance.setColorScheme(state.isDark ? "dark" : "light");
                }
            },
        },
    ),
);
