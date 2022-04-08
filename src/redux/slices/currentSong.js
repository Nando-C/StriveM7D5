import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  track: {},
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: 0.5,
};

const currentSongSlice = createSlice({
  name: "currentSong",
  initialState,
  reducers: {
    selectSong(state, action) {
      state.track = action.payload;
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setDuration(state, action) {
      state.duration = action.payload;
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
    },
    setCurrentVolume(state, action) {
      state.volume = action.payload;
    },
  },
});
export const {
  selectSong,
  setIsPlaying,
  setDuration,
  setCurrentTime,
  setCurrentVolume,
} = currentSongSlice.actions;

export default currentSongSlice.reducer;
