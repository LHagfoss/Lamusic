import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../lib/authStore";
import { authService } from "../services/authService";

export function useAuth() {
    const { session, initialized, setSession } = useAuthStore();

    return {
        user: session?.user ?? null,
        loading: !initialized,
        signIn: authService.signInWithGoogle,
        signOut: authService.signOut,
    };
}
