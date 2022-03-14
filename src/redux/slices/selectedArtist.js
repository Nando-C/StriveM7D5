import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  artistInfo: {
    artist: {},
    status: "idle",
    error: null,
  },
  albumList: {
    albums: [],
    status: "idle",
    error: null,
  },
  topTrackList: {
    topTracks: [],
    status: "idle",
    error: null,
  },
};

export const fetchArtist = createAsyncThunk(
  "artistInfo/fecthArtist",
  async (artistId) => {
    const { data } = await backend.get(`/artist/${artistId}`);
    return data;
  }
);

export const fetchAlbums = createAsyncThunk(
  "albumList/fetchAlbums",
  async (artistId) => {
    const { data } = await backend.get(`/artist/${artistId}/albums`);
    return data;
  }
);

export const fetchArtistTopTracks = createAsyncThunk(
  "topTrackList/fetchArtistTopTracks",
  async (artistId) => {
    const { data } = await backend.get(`/artist/${artistId}/top?limit=10`);
    return data;
  }
);

const selectedArtistSlice = createSlice({
  name: "selectedArtist",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchArtist.pending, (state, action) => {
        state.artistInfo.status = "loading";
      })
      .addCase(fetchArtist.fulfilled, (state, action) => {
        state.artistInfo.status = "succeded";
        state.artistInfo.artist = action.payload;
        // console.log("Artist Payload: ", action.payload);
      })
      .addCase(fetchArtist.rejected, (state, action) => {
        state.artistInfo.status = "failed";
        state.artistInfo.error = action.error.message;
        console.log(state.artistInfo.error);
      })
      .addCase(fetchAlbums.pending, (state, action) => {
        state.albumList.status = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albumList.status = "succeded";
        state.albumList.albums = action.payload.data;
        // console.log("Albums Payload: ", action.payload.data);
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.albumList.status = "failed";
        state.albumList.error = action.error.message;
        console.log(state.albumList.error);
      })
      .addCase(fetchArtistTopTracks.pending, (state, action) => {
        state.topTrackList.status = "loading";
      })
      .addCase(fetchArtistTopTracks.fulfilled, (state, action) => {
        state.topTrackList.status = "succeded";
        const sortedList = action.payload.data.sort((a, b) => b.rank - a.rank);
        state.topTrackList.topTracks = sortedList;
        // console.log("Top Tracks Payload: ", action.payload.data);
      })
      .addCase(fetchArtistTopTracks.rejected, (state, action) => {
        state.topTrackList.status = "failed";
        state.topTrackList.error = action.error.message;
        console.log(state.topTrackList.error);
      });
  },
});

export default selectedArtistSlice.reducer;
