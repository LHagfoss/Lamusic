import { z } from "zod";

export const artistSchema = z.object({
    name: z.string().min(1, "Artist name is required").trim(),
    image_url: z.string().url().optional().nullable(),
});

export const albumSchema = z.object({
    title: z.string().min(1, "Album title is required").trim(),
    cover_url: z.string().url().optional().nullable(),
    artist_id: z.string().uuid("Invalid artist selection"),
});

export const songSchema = z.object({
    title: z.string().min(1, "Song title is required").trim(),
    audio_url: z.string().url("Audio file upload failed"),
    cover_url: z.string().url().optional().nullable(),
    duration: z.number().optional(),
    artist_id: z.string().uuid("Invalid artist selection"),
    album_id: z.string().uuid("Invalid album selection"),
});

export type ArtistInput = z.infer<typeof artistSchema>;
export type AlbumInput = z.infer<typeof albumSchema>;
export type SongInput = z.infer<typeof songSchema>;
