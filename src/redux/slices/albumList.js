import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../app/store";

const initialState = {
  albums: [],
  status: "idle",
  error: null,
};

export const fetchAlbums = createAsyncThunk("albums/fetchAlbums", async () => {
  const response = await fetch(
    "https://striveschool-api.herokuapp.com/api/deezer/search?q=the"
  );
  const albumList = response.json();
  return albumList;
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
        state.status = " succeded";
        state.albums = action.payload.data;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.erro = action.error.message;
      });
  },
});

export default albumsSlice.reducer;

export const selectAllAlbums = (state) => state.albums.albums;

export const selectAlbumById = (state, albumId) =>
  state.albums.albums.find((album) => album.id === albumId);
