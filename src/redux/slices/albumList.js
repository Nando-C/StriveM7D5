import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  albums: [],
  status: "idle",
  error: null,
};

export const fetchAlbums = createAsyncThunk("albums/fetchAlbums", async () => {
  const { data } = await backend.get("/search?q=the");
  return data;
});

const albumsSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAlbums.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = "succeded";
        state.albums = action.payload.data;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default albumsSlice.reducer;

export const selectAllAlbums = (state) => state.albums.albums;

export const selectAlbumById = (state, albumId) =>
  state.albums.albums.find((album) => album.id === albumId);
