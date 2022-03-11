import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  artistInfo: {
    artist: {},
    status: "idle",
    error: null,
  },
  albumInfo: {
    albums: {},
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
  "albumInfo/fetchAlbums",
  async (artistId) => {
    const { data } = await backend.get(`/artist/${artistId}/albums`);
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
        console.log("Artist Load: ", action.payload);
      })
      .addCase(fetchArtist.rejected, (state, action) => {
        state.artistInfo.status = "failed";
        state.artistInfo.error = action.error.message;
        console.log(state.artistInfo.error);
      })
      .addCase(fetchAlbums.pending, (state, action) => {
        state.albumInfo.status = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albumInfo.status = "succeded";
        state.albumInfo.albums = action.payload.data;
        // console.log("Albums Payload: ", action.payload.data);
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.albumInfo.status = "failed";
        state.albumInfo.error = action.error.message;
        console.log(state.albumInfo.error);
      });
  },
});

export default selectedArtistSlice.reducer;

export const selectedArtistInfo = (state) => state.selectedArtist.artistInfo;
export const selectedAlbumsInfo = (state) => state.selectedArtist.albumInfo;
