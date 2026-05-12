import { supabase } from "../lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

// Required for the browser to return to the app after auth
WebBrowser.maybeCompleteAuthSession();

export const authService = {
    async signInWithGoogle() {
        try {
            const redirectTo = makeRedirectUri({
                scheme: "lamusic",
                path: "google-auth",
            });
            
            console.log("Redirect URI:", redirectTo);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo,
                    skipBrowserRedirect: true,
                    queryParams: {
                        prompt: "select_account",
                        access_type: "offline",
                    },
                },
            });

            if (error) throw error;

            if (data?.url) {
                console.log("Supabase Auth URL:", data.url);
                const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

                if (res.type === "success" && res.url) {
                    const { url } = res;
                    console.log("Auth session success, parsing tokens...");
                    
                    const fragment = url.split("#")[1];
                    if (fragment) {
                        const params = fragment.split("&").reduce((acc, part) => {
                            const [key, value] = part.split("=");
                            acc[key] = value;
                            return acc;
                        }, {} as Record<string, string>);

                        const { access_token, refresh_token } = params;

                        if (access_token && refresh_token) {
                            console.log("Setting session manually from browser result...");
                            const { error: sessionError } = await supabase.auth.setSession({
                                access_token,
                                refresh_token,
                            });
                            if (sessionError) throw sessionError;
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            throw error;
        }
    },


    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) return null;
        return user;
    }
};
