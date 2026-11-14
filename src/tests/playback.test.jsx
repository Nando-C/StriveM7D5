import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { delay, http } from "msw";
import { Route, Routes } from "react-router";
import AlbumPage from "../Components/Content/AlbumPage/AlbumPage";
import Artist from "../Components/Content/Artist/Artist";
import PlayerControls from "../Components/Player/PlayerControls/PlayerControls";
import Volume from "../Components/Player/Volume/Volume";
import TrackList from "../Components/TrackList/TrackList";
import { selectSong, setIsPlaying } from "../redux/slices/currentSong";
import { playOrToggle } from "../utils/playback";
import { toPlayableTrack } from "../utils/track";
import { stubAudio } from "./audio";
import { album, artist, makeTrack } from "./fixtures";
import { API, server } from "./server";
import { renderWithProviders } from "./utils";

let audioStub;
beforeEach(() => {
  audioStub = stubAudio();
});
afterEach(() => vi.restoreAllMocks());

const renderAlbumTracks = () => {
  const view = renderWithProviders(
    <>
      <TrackList album={album} />
      <PlayerControls />
    </>
  );
  return {
    ...view,
    rowButtons: view.container.querySelectorAll(".table-row .play-btn"),
    audio: view.container.querySelector("audio"),
    progressBar: view.container.querySelector(".Progress-Bar input"),
    playerButton: view.container.querySelector(".PlayerControls .play"),
  };
};

describe("progress loop", () => {
  it("runs one loop however often the track changes, and none while paused", () => {
    const { rowButtons, playerButton } = renderAlbumTracks();

    fireEvent.click(rowButtons[0]);
    expect(audioStub.pendingFrames()).toBe(1);

    fireEvent.click(rowButtons[1]);
    fireEvent.click(rowButtons[0]);
    fireEvent.click(rowButtons[1]);
    expect(audioStub.pendingFrames()).toBe(1);

    fireEvent.click(playerButton); // pause
    expect(audioStub.pendingFrames()).toBe(0);
  });

  it("keeps going from frame to frame while the track plays", () => {
    const { rowButtons } = renderAlbumTracks();
    fireEvent.click(rowButtons[0]);

    act(() => audioStub.runFrames());
    act(() => audioStub.runFrames());

    expect(audioStub.pendingFrames()).toBe(1);
  });

  it("fills the progress bar for the first track played", () => {
    const { rowButtons, audio, progressBar } = renderAlbumTracks();
    fireEvent.click(rowButtons[0]);

    Object.defineProperty(audio, "duration", { value: 30, configurable: true });
    fireEvent.loadedMetadata(audio);
    Object.defineProperty(audio, "currentTime", {
      value: 15,
      configurable: true,
    });
    act(() => audioStub.runFrames());

    expect(progressBar.style.getPropertyValue("--seek-before-width")).toBe(
      "50%"
    );
  });

  it("stops when the track ends, and the same track can be played again", () => {
    const { store, rowButtons, audio } = renderAlbumTracks();
    const [first] = album.tracks.data;
    fireEvent.click(rowButtons[0]);

    Object.defineProperty(audio, "ended", { value: true, configurable: true });
    act(() => audioStub.runFrames());

    expect(store.getState().currentSong.isPlaying).toBe(false);
    expect(audioStub.pendingFrames()).toBe(0);

    audioStub.playedSrcs.length = 0;
    fireEvent.click(rowButtons[0]);

    expect(store.getState().currentSong.isPlaying).toBe(true);
    expect(audioStub.playedSrcs).toEqual([first.preview]);
  });
});

describe("Artist page play button", () => {
  const renderArtist = () => {
    const view = renderWithProviders(
      <>
        <Routes>
          <Route path="/Artist/:artistId" element={<Artist />} />
        </Routes>
        <PlayerControls />
      </>,
      { route: `/Artist/${artist.id}` }
    );
    return {
      ...view,
      playButton: () => view.container.querySelector(".options .play-btn"),
    };
  };

  it("plays the artist's top-ranked track as the first interaction", async () => {
    const { store, playButton } = renderArtist();
    await screen.findByText("Top Ranked");

    fireEvent.click(playButton());

    const { track, isPlaying } = store.getState().currentSong;
    expect(track.title).toBe("Top Ranked");
    expect(isPlaying).toBe(true);
    expect(audioStub.playedSrcs.at(-1)).toBe(track.preview);
  });

  it("pauses on a second click", async () => {
    const { store, playButton } = renderArtist();
    await screen.findByText("Top Ranked");

    fireEvent.click(playButton());
    fireEvent.click(playButton());

    expect(store.getState().currentSong.isPlaying).toBe(false);
    expect(audioStub.pause).toHaveBeenCalledTimes(1);
  });

  it("does nothing while the top tracks have not loaded", async () => {
    // The artist arrives, the top tracks never do.
    server.use(http.get(`${API}/artist/:id/top`, () => delay("infinite")));
    const { store, playButton } = renderArtist();
    await screen.findByText(artist.name);

    fireEvent.click(playButton());

    expect(store.getState().currentSong.track).toEqual({});
    expect(store.getState().currentSong.isPlaying).toBe(false);
    expect(audioStub.playedSrcs).toEqual([]);
  });
});

describe("Album page play button", () => {
  it("plays the album's first track, with the album attached to it", async () => {
    const { store, container } = renderWithProviders(
      <>
        <Routes>
          <Route path="/Album/:albumId" element={<AlbumPage />} />
        </Routes>
        <PlayerControls />
      </>,
      { route: `/Album/${album.id}` }
    );
    await screen.findByText("Album Track One");

    fireEvent.click(container.querySelector(".options .play-btn"));

    const { track, isPlaying } = store.getState().currentSong;
    expect(track).toEqual(toPlayableTrack(album.tracks.data[0], album));
    expect(track.album.title).toBe("Test Album");
    expect(isPlaying).toBe(true);
    expect(audioStub.playedSrcs.at(-1)).toBe(track.preview);
  });
});

describe("Volume", () => {
  it("stores the volume as a number", () => {
    const { store, container } = renderWithProviders(<Volume />);

    fireEvent.change(container.querySelector(".volume-bar input"), {
      target: { value: "0.3" },
    });

    expect(store.getState().currentSong.volume).toBe(0.3);
  });
});

describe("playOrToggle", () => {
  const track = makeTrack(1, "Any");

  it("toggles play/pause for the track that is already loaded", () => {
    const dispatch = vi.fn();

    playOrToggle(dispatch, { isSameTrack: true, isPlaying: true, track });
    playOrToggle(dispatch, { isSameTrack: true, isPlaying: false, track });

    expect(dispatch.mock.calls).toEqual([
      [setIsPlaying(false)],
      [setIsPlaying(true)],
    ]);
  });

  it("loads a different track and plays it, whatever was playing before", () => {
    for (const isPlaying of [true, false]) {
      const dispatch = vi.fn();

      playOrToggle(dispatch, { isSameTrack: false, isPlaying, track });

      expect(dispatch.mock.calls).toEqual([
        [selectSong(toPlayableTrack(track))],
        [setIsPlaying(true)],
      ]);
    }
  });

  it("does nothing when there is no track to play yet", () => {
    const dispatch = vi.fn();

    playOrToggle(dispatch, {
      isSameTrack: false,
      isPlaying: false,
      track: undefined,
    });

    expect(dispatch).not.toHaveBeenCalled();
  });
});
