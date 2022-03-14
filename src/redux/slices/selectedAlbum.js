import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  album: {},
  status: "idle",
  error: null,
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
        state.status = "loading";
      })
      .addCase(fetchAlbum.fulfilled, (state, action) => {
        state.status = "succeded";
        state.album = action.payload;
        console.log("Album Payload: ", action.payload);
      })
      .addCase(fetchAlbum.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log(state.error);
      });
  },
});

export default selectedAlbumSlice.reducer;
