import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  artist: {},
  album: {},
  status: "idle",
  error: null,
};

export const fetchArtist = createAsyncThunk(
  "chosen/fecthArtist",
  async (artistId) => {
    const { data } = await backend.get(`/artist/${artistId}`);
    return data;
  }
);

const chosenSlice = createSlice({
  name: "chosen",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchArtist.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchArtist.fulfilled, (state, action) => {
        state.status = "succeded";
        state.artist = action.payload;
      })
      .addCase(fetchArtist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log(state.error);
      });
  },
});

export default chosenSlice.reducer;

export const selectedArtist = (state) => state;
