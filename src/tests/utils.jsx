import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import homeReducer from "../redux/slices/home";
import selectedArtistReducer from "../redux/slices/selectedArtist";
import selectedAlbumReducer from "../redux/slices/selectedAlbum";
import currentSongReducer from "../redux/slices/currentSong";

// A fresh store per test, with the same reducers as the app's store.
export const createTestStore = (preloadedState) =>
  configureStore({
    reducer: {
      home: homeReducer,
      selectedArtist: selectedArtistReducer,
      selectedAlbum: selectedAlbumReducer,
      currentSong: currentSongReducer,
    },
    preloadedState,
  });

export const renderWithProviders = (
  ui,
  { preloadedState, store = createTestStore(preloadedState), route = "/" } = {}
) => ({
  store,
  ...render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  ),
});
