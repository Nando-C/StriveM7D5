import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  albumInfo: {
    album: {},
    status: "idle",
    error: null,
  },
  trackList: {
    tracks: [],
    status: "idle",
    error: null,
  },
};

export const fetchAlbum = createAsyncThunk(
  "albumInfo/fetchAlbum",
  async (albumId) => {
    const { data } = await backend.get(`/album/${albumId}`);
    return data;
  }
);

const selectedAlbumSlice = createSlice({
  name: "selectedAlbum",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAlbum.pending, (state, action) => {
        state.albumInfo.status = "loading";
      })
      .addCase(fetchAlbum.fulfilled, (state, action) => {
        state.albumInfo.status = "succeded";
        state.albumInfo.album = action.payload;
        console.log("Album Payload: ", action.payload);
      })
      .addCase(fetchAlbum.rejected, (state, action) => {
        state.albumInfo.status = "failed";
        state.albumInfo.error = action.error.message;
        console.log(state.albumInfo.error);
      });
  },
});

export default selectedAlbumSlice.reducer;
