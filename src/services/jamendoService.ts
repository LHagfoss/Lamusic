const CLIENT_ID = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID ?? "";
const BASE = "https://api.jamendo.com/v3.0";

export interface JamendoTrack {
    id: string;
    name: string;
    duration: number;
    artist_name: string;
    album_name: string;
    album_image: string;
    audio: string;
    image: string;
}

export async function searchTracks(query: string, limit = 20): Promise<JamendoTrack[]> {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        format: "json",
        limit: String(limit),
        imagesize: "200",
        search: query,
    });

    const res = await fetch(`${BASE}/tracks?${params}`);
    if (!res.ok) throw new Error(`Jamendo ${res.status}`);
    const json = await res.json();
    return json.results ?? [];
}
