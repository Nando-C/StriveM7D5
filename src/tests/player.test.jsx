import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import PlayerControls from "../Components/Player/PlayerControls/PlayerControls";
import TrackList from "../Components/TrackList/TrackList";
import { calculateTime } from "../utils/audioPlayer";
import { album, makeTrack } from "./fixtures";
import { renderWithProviders } from "./utils";

// jsdom has no audio playback. The stubs record which `src` the element had
// at the moment play() was called: "isPlaying is true in the store" is not
// enough, the failure worth catching is a playing UI over a silent element.
let playedSrcs;
let pause;

beforeEach(() => {
  playedSrcs = [];
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function () {
    playedSrcs.push(this.getAttribute("src"));
    return Promise.resolve();
  });
  pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  // The progress loop reschedules itself every frame and is not what these
  // tests are about.
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

const currentSong = (overrides) => ({
  track: {},
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: 0.5,
  ...overrides,
});

describe("PlayerControls", () => {
  it("plays and pauses the loaded track from the player bar", () => {
    const track = makeTrack(1, "Loaded");
    const { store, container } = renderWithProviders(<PlayerControls />, {
      preloadedState: { currentSong: currentSong({ track }) },
    });
    const button = container.querySelector(".play");

    fireEvent.click(button);
    expect(store.getState().currentSong.isPlaying).toBe(true);
    expect(playedSrcs).toEqual([track.preview]);

    pause.mockClear(); // mounting with a paused track already calls pause()
    fireEvent.click(button);
    expect(store.getState().currentSong.isPlaying).toBe(false);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it("does nothing when no track is loaded", () => {
    const { store, container } = renderWithProviders(<PlayerControls />);

    fireEvent.click(container.querySelector(".play"));

    expect(store.getState().currentSong.isPlaying).toBe(false);
    expect(playedSrcs).toEqual([]);
  });

  it("applies the stored volume to the audio element", () => {
    const { container } = renderWithProviders(<PlayerControls />, {
      preloadedState: { currentSong: currentSong({ volume: 0.2 }) },
    });

    expect(container.querySelector("audio").volume).toBeCloseTo(0.2);
  });
});

describe("track switching from a track list", () => {
  const [first, second] = album.tracks.data;

  const renderAlbum = () => {
    const view = renderWithProviders(
      <>
        <TrackList />
        <PlayerControls />
      </>,
      {
        preloadedState: {
          selectedAlbum: { album, status: "succeded", error: null },
        },
      }
    );
    const rowButtons = view.container.querySelectorAll(".table-row .play-btn");
    return { ...view, rowButtons, audio: view.container.querySelector("audio") };
  };

  it("plays a track when nothing is loaded", () => {
    const { store, rowButtons, audio } = renderAlbum();

    fireEvent.click(rowButtons[0]);

    expect(store.getState().currentSong.track.id).toBe(first.id);
    expect(store.getState().currentSong.isPlaying).toBe(true);
    expect(audio).toHaveAttribute("src", first.preview);
    expect(playedSrcs.at(-1)).toBe(first.preview);
  });

  it("switches to a different track while one is playing, and plays it", () => {
    const { store, rowButtons, audio } = renderAlbum();
    fireEvent.click(rowButtons[0]);
    pause.mockClear();

    fireEvent.click(rowButtons[1]);

    expect(store.getState().currentSong.track.id).toBe(second.id);
    expect(store.getState().currentSong.isPlaying).toBe(true);
    expect(audio).toHaveAttribute("src", second.preview);
    // play() was called again once the element pointed at the new track
    expect(playedSrcs.at(-1)).toBe(second.preview);
    expect(pause).not.toHaveBeenCalled();
  });

  it("pauses when the playing track is clicked again", () => {
    const { store, rowButtons } = renderAlbum();
    fireEvent.click(rowButtons[0]);

    fireEvent.click(rowButtons[0]);

    expect(store.getState().currentSong.track.id).toBe(first.id);
    expect(store.getState().currentSong.isPlaying).toBe(false);
    expect(pause).toHaveBeenCalledTimes(1);
  });
});

describe("calculateTime", () => {
  it("formats seconds as mm:ss", () => {
    expect(calculateTime(0)).toBe("00:00");
    expect(calculateTime(5)).toBe("00:05");
    expect(calculateTime(29.9)).toBe("00:29");
    expect(calculateTime(75)).toBe("01:15");
    expect(calculateTime(600)).toBe("10:00");
  });
});
