import { supabase } from "../lib/supabase";
import type { AlbumInput, ArtistInput, SongInput } from "../types/schemas";

export const musicService = {
    // --- Artists ---
    async getArtists() {
        const { data, error } = await supabase
            .from("artists")
            .select("*")
            .order("name");
        if (error) throw error;
        return data;
    },

    async searchArtists(query: string) {
        const { data, error } = await supabase
            .from("artists")
            .select("*")
            .ilike("name", `%${query}%`)
            .limit(10);
        if (error) throw error;
        return data;
    },

    async createArtist(input: ArtistInput) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from("artists")
            .insert([{ ...input, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateArtist(id: string, input: Partial<ArtistInput>) {
        const { data, error } = await supabase
            .from("artists")
            .update(input)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteArtist(id: string) {
        const { error } = await supabase.from("artists").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Albums ---
    async getAlbumsByArtist(artistId: string) {
        const { data, error } = await supabase
            .from("albums")
            .select("*")
            .eq("artist_id", artistId)
            .order("title");
        if (error) throw error;
        return data;
    },

    async createAlbum(input: AlbumInput) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from("albums")
            .insert([{ ...input, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateAlbum(id: string, input: Partial<AlbumInput>) {
        const { data, error } = await supabase
            .from("albums")
            .update(input)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteAlbum(id: string) {
        const { error } = await supabase.from("albums").delete().eq("id", id);
        if (error) throw error;
    },

    // --- Songs ---
    async createSong(input: SongInput) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from("songs")
            .insert([{ ...input, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateSong(id: string, input: Partial<SongInput>) {
        const { data, error } = await supabase
            .from("songs")
            .update(input)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteSong(id: string) {
        const { error } = await supabase.from("songs").delete().eq("id", id);
        if (error) throw error;
    },

    async getRecentSongs() {
        const { data, error } = await supabase
            .from("songs")
            .select(`
                *,
                artists (name, image_url),
                albums (title, cover_url)
            `)
            .order("created_at", { ascending: false })
            .limit(10);
        if (error) throw error;
        return data;
    },

    async toggleFavorite(songId: string, isFavorite: boolean) {
        const { data, error } = await supabase
            .from("songs")
            .update({ is_favorite: isFavorite })
            .eq("id", songId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async toggleArtistFavorite(artistId: string, isFavorite: boolean) {
        const { data, error } = await supabase
            .from("artists")
            .update({ is_favorite: isFavorite })
            .eq("id", artistId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async toggleAlbumFavorite(albumId: string, isFavorite: boolean) {
        const { data, error } = await supabase
            .from("albums")
            .update({ is_favorite: isFavorite })
            .eq("id", albumId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getLibrary() {
        // Fetch everything in one go for a relational view
        const { data, error } = await supabase
            .from("artists")
            .select(`
                *,
                albums (
                    *,
                    songs (*)
                )
            `)
            .order("name");
        if (error) throw error;
        return data;
    },

    async getMyContent() {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from("artists")
            .select(`
                *,
                albums (
                    *,
                    songs (*)
                )
            `)
            .eq("user_id", user.id)
            .order("name");
        if (error) throw error;
        return data;
    },
};
