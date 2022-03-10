import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  albums: [],
  status: "idle",
  error: null,
};

export const fetchAlbums = createAsyncThunk("home/fetchAlbums", async () => {
  const { data } = await backend.get("/search?q=the");
  return data;
});

const homeSlice = createSlice({
  name: "home",
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
        console.log(state.error);
      });
  },
});

export default homeSlice.reducer;

export const selectAllAlbums = (state) => state.home.albums;

export const selectAlbumById = (state, albumId) =>
  state.home.albums.find((album) => album.id === albumId);
