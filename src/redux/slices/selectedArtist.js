import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  artistInfo: {
    artist: {},
    status: "idle",
    error: null,
  },
};

export const fetchArtist = createAsyncThunk(
  "chosen/fecthArtist",
  async (artistId) => {
    const { data } = await backend.get(`/artist/${artistId}`);
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
      })
      .addCase(fetchArtist.rejected, (state, action) => {
        state.artistInfo.status = "failed";
        state.artistInfo.error = action.error.message;
        console.log(state.artistInfo.error);
      });
  },
});

export default selectedArtistSlice.reducer;

export const selectedArtist = (state) => state.artistInfo;
