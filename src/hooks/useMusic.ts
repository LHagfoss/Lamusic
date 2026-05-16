import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { musicService } from "../services/musicService";
import { storageService } from "../services/storageService";
import type { AlbumInput, ArtistInput, SongInput } from "../types/schemas";

export function useMusic() {
    const queryClient = useQueryClient();

    // --- Queries ---

    const useArtists = () =>
        useQuery({
            queryKey: ["artists"],
            queryFn: musicService.getArtists,
        });

    const useSearchArtists = (query: string) =>
        useQuery({
            queryKey: ["artists", "search", query],
            queryFn: () => musicService.searchArtists(query),
            enabled: query.length > 0,
        });

    const useSearchSongs = (query: string) =>
        useQuery({
            queryKey: ["songs", "search", query],
            queryFn: () => musicService.searchSongs(query),
            enabled: query.length > 0,
        });

    const useSearchAlbums = (query: string) =>
        useQuery({
            queryKey: ["albums", "search", query],
            queryFn: () => musicService.searchAlbums(query),
            enabled: query.length > 0,
        });

    const useAlbums = (artistId?: string) =>
        useQuery({
            queryKey: ["albums", artistId],
            queryFn: () => musicService.getAlbumsByArtist(artistId!),
            enabled: !!artistId,
        });

    const useLibrary = () =>
        useQuery({
            queryKey: ["library"],
            queryFn: musicService.getLibrary,
        });

    const useMyContent = () =>
        useQuery({
            queryKey: ["my-content"],
            queryFn: musicService.getMyContent,
        });

    const useRecentSongs = () =>
        useQuery({
            queryKey: ["songs", "recent"],
            queryFn: musicService.getRecentSongs,
        });

    const usePlayHistory = (limit = 20) =>
        useQuery({
            queryKey: ["play-history", limit],
            queryFn: () => musicService.getPlayHistory(limit),
        });

    // --- Mutations ---

    const useCreateArtist = () =>
        useMutation({
            mutationFn: musicService.createArtist,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["artists"] });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    const useUpdateArtist = () =>
        useMutation({
            mutationFn: ({
                id,
                input,
            }: {
                id: string;
                input: Partial<ArtistInput>;
            }) => musicService.updateArtist(id, input),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["artists"] });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
                queryClient.invalidateQueries({ queryKey: ["library"] });
            },
        });

    const useDeleteArtist = () =>
        useMutation({
            mutationFn: musicService.deleteArtist,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["artists"] });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
                queryClient.invalidateQueries({ queryKey: ["library"] });
            },
        });

    const useCreateAlbum = () =>
        useMutation({
            mutationFn: musicService.createAlbum,
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: ["albums", data.artist_id],
                });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    const useUpdateAlbum = () =>
        useMutation({
            mutationFn: ({
                id,
                input,
            }: {
                id: string;
                input: Partial<AlbumInput>;
            }) => musicService.updateAlbum(id, input),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
                queryClient.invalidateQueries({ queryKey: ["library"] });
            },
        });

    const useDeleteAlbum = () =>
        useMutation({
            mutationFn: musicService.deleteAlbum,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
                queryClient.invalidateQueries({ queryKey: ["library"] });
            },
        });

    const useCreateSong = () =>
        useMutation({
            mutationFn: musicService.createSong,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["library"] });
                queryClient.invalidateQueries({
                    queryKey: ["songs", "recent"],
                });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    const useUpdateSong = () =>
        useMutation({
            mutationFn: ({
                id,
                input,
            }: {
                id: string;
                input: Partial<SongInput>;
            }) => musicService.updateSong(id, input),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["library"] });
                queryClient.invalidateQueries({
                    queryKey: ["songs", "recent"],
                });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    const useDeleteSong = () =>
        useMutation({
            mutationFn: musicService.deleteSong,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["library"] });
                queryClient.invalidateQueries({
                    queryKey: ["songs", "recent"],
                });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    const useToggleFavorite = () =>
        useMutation({
            mutationFn: ({
                songId,
                isFavorite,
            }: {
                songId: string;
                isFavorite: boolean;
            }) => musicService.toggleFavorite(songId, isFavorite),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["library"] });
                queryClient.invalidateQueries({
                    queryKey: ["songs", "recent"],
                });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    const useToggleArtistFavorite = () =>
        useMutation({
            mutationFn: ({
                artistId,
                isFavorite,
            }: {
                artistId: string;
                isFavorite: boolean;
            }) => musicService.toggleArtistFavorite(artistId, isFavorite),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["library"] });
                queryClient.invalidateQueries({ queryKey: ["artists"] });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    const useToggleAlbumFavorite = () =>
        useMutation({
            mutationFn: ({
                albumId,
                isFavorite,
            }: {
                albumId: string;
                isFavorite: boolean;
            }) => musicService.toggleAlbumFavorite(albumId, isFavorite),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["library"] });
                queryClient.invalidateQueries({ queryKey: ["my-content"] });
            },
        });

    return {
        useArtists,
        useSearchArtists,
        useSearchSongs,
        useSearchAlbums,
        useAlbums,
        useLibrary,
        useMyContent,
        useRecentSongs,
        usePlayHistory,
        useCreateArtist,
        useUpdateArtist,
        useDeleteArtist,
        useCreateAlbum,
        useUpdateAlbum,
        useDeleteAlbum,
        useCreateSong,
        useUpdateSong,
        useDeleteSong,
        useToggleFavorite,
        useToggleArtistFavorite,
        useToggleAlbumFavorite,
        uploadAudio: storageService.uploadAudio.bind(storageService),
        uploadImage: storageService.uploadImage.bind(storageService),
    };
}
