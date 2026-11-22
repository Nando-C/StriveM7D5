import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  track: {},
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: 0.5,
  // The loaded track's audio could not be loaded, even with a fresh link.
  loadFailed: false,
};

const currentSongSlice = createSlice({
  name: "currentSong",
  initialState,
  reducers: {
    selectSong(state, action) {
      state.track = action.payload;
      state.loadFailed = false;
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
    setLoadFailed(state, action) {
      state.loadFailed = action.payload;
    },
  },
});
export const {
  selectSong,
  setIsPlaying,
  setDuration,
  setCurrentTime,
  setCurrentVolume,
  setLoadFailed,
} = currentSongSlice.actions;

export default currentSongSlice.reducer;
