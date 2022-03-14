import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backend from "../../backend/axios";

const initialState = {
  trackList: [],
  status: "idle",
  error: null,
};

export const fetchHomeTrackList = createAsyncThunk(
  "home/fetchHomeTrackList",
  async () => {
    const { data } = await backend.get("/search?q=the");
    return data;
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchHomeTrackList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchHomeTrackList.fulfilled, (state, action) => {
        state.status = "succeded";
        state.trackList = action.payload.data;
      })
      .addCase(fetchHomeTrackList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log(state.error);
      });
  },
});

export default homeSlice.reducer;

export const selectTrackList = (state) => state.home.trackList;
