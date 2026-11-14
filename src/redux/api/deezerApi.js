import { createApi } from "@reduxjs/toolkit/query/react";
import backend from "../../backend/axios";

// Every request still goes through the shared axios instance.
const axiosBaseQuery = async ({ url, params }, { signal }) => {
  try {
    const { data } = await backend.get(url, { params, signal });
    // Deezer reports some failures (an unknown id, a quota limit) as HTTP 200
    // with an `error` object for a body.
    if (data?.error) {
      return {
        error: { status: 200, message: data.error.message ?? "Deezer error" },
      };
    }
    return { data };
  } catch (error) {
    return {
      error: { status: error.response?.status, message: error.message },
    };
  }
};

const list = (response) => response.data ?? [];

export const deezerApi = createApi({
  reducerPath: "deezerApi",
  baseQuery: axiosBaseQuery,
  // How long a result stays cached after the last component using it is gone.
  // Going back to a page within this time shows it without a request.
  keepUnusedDataFor: 300,
  endpoints: (build) => ({
    // Also used for the home page's list.
    search: build.query({
      query: (q) => ({ url: "/search", params: { q } }),
      transformResponse: list,
      // Shorter than the pages': every pause in typing leaves a result list
      // behind, and few of them are ever asked for again.
      keepUnusedDataFor: 60,
    }),
    getArtist: build.query({
      query: (artistId) => ({ url: `/artist/${artistId}` }),
    }),
    getArtistAlbums: build.query({
      query: (artistId) => ({ url: `/artist/${artistId}/albums` }),
      transformResponse: list,
    }),
    getArtistTopTracks: build.query({
      query: (artistId) => ({
        url: `/artist/${artistId}/top`,
        params: { limit: 10 },
      }),
      // Highest rank first.
      transformResponse: (response) =>
        [...list(response)].sort((a, b) => b.rank - a.rank),
    }),
    getAlbum: build.query({
      query: (albumId) => ({ url: `/album/${albumId}` }),
    }),
  }),
});

// Search and the home page read the hook's result as it is.
export const { useSearchQuery } = deezerApi;

// The hooks that take an id report only what belongs to that id. RTK Query's
// own `data` keeps the previous id's result until the new one arrives, which
// would show one artist's content under another artist's address, so these
// are built on `currentData`, and "nothing yet and no error" is the loading
// state (`isLoading` is false once anything has ever loaded).
const forCurrentId = ({ currentData, isError }) => ({
  data: currentData,
  isLoading: currentData === undefined && !isError,
  isError,
});

export const useGetArtistQuery = (artistId) =>
  forCurrentId(deezerApi.useGetArtistQuery(artistId));
export const useGetArtistAlbumsQuery = (artistId) =>
  forCurrentId(deezerApi.useGetArtistAlbumsQuery(artistId));
export const useGetArtistTopTracksQuery = (artistId) =>
  forCurrentId(deezerApi.useGetArtistTopTracksQuery(artistId));
export const useGetAlbumQuery = (albumId) =>
  forCurrentId(deezerApi.useGetAlbumQuery(albumId));
