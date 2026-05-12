import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface AuthStore {
    session: Session | null;
    initialized: boolean;
    setSession: (session: Session | null) => void;
    setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    session: null,
    initialized: false,
    setSession: (session) => set({ session }),
    setInitialized: (initialized) => set({ initialized }),
}));
