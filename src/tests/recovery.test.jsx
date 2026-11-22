import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import AlbumPage from "../Components/Content/AlbumPage/AlbumPage";
import Player from "../Components/Player/Player";
import PlayerControls from "../Components/Player/PlayerControls/PlayerControls";
import TrackList from "../Components/TrackList/TrackList";
import { makeStore } from "../redux/app/store";
import { stubAudio } from "./audio";
import { album, makeTrack } from "./fixtures";
import { playOrToggle } from "../utils/playback";
import { API, requestLog, requestsTo, server } from "./server";
import { renderWithProviders } from "./utils";

let audioStub;
beforeEach(() => {
  audioStub = stubAudio();
});
afterEach(() => vi.restoreAllMocks());

const [first, second] = album.tracks.data;
const LAST_TRACK = "nandotify:lastTrack";
const FAILED = "This preview can't be played";

// The same album, with a new link on every track: what the API returns when
// asked again after the old links have expired.
const withFreshLinks = (tag = "fresh") => ({
  ...album,
  tracks: {
    data: album.tracks.data.map((track) => ({
      ...track,
      preview: `${track.preview}?${tag}`,
    })),
  },
});
const answerAlbumWith = (body) =>
  server.use(http.get(`${API}/album/:id`, () => HttpResponse.json(body)));

const renderAlbumAndPlayer = () => {
  const view = renderWithProviders(
    <>
      <TrackList album={album} />
      <Player />
    </>,
  );
  return { ...view, audio: view.container.querySelector("audio") };
};
const play = (track) =>
  fireEvent.click(screen.getByRole("button", { name: `Play ${track.title}` }));
const song = (store) => store.getState().currentSong;

describe("a preview link that no longer works", () => {
  it("fetches the track again and plays the fresh link", async () => {
    const { store, audio } = renderAlbumAndPlayer();
    play(first);
    expect(audioStub.playedSrcs).toEqual([first.preview]);

    answerAlbumWith(withFreshLinks());
    fireEvent.error(audio);

    await waitFor(() =>
      expect(audioStub.playedSrcs).toEqual([
        first.preview,
        `${first.preview}?fresh`,
      ]),
    );
    expect(requestsTo(`/album/${album.id}`)).toBe(1);
    expect(song(store).track.id).toBe(first.id);
    expect(song(store).isPlaying).toBe(true);
    expect(song(store).loadFailed).toBe(false);
    expect(screen.queryByText(FAILED)).not.toBeInTheDocument();
  });

  it("stops and says so when the fresh link fails as well", async () => {
    const { store, audio } = renderAlbumAndPlayer();
    play(first);
    answerAlbumWith(withFreshLinks());
    fireEvent.error(audio);
    await waitFor(() => expect(song(store).track.preview).toMatch(/fresh$/));

    fireEvent.error(audio);

    expect(await screen.findByText(FAILED)).toBeInTheDocument();
    expect(song(store).isPlaying).toBe(false);
    // One attempt, not a loop of requests.
    expect(requestsTo(`/album/${album.id}`)).toBe(1);
  });

  it("stops and says so when the track cannot be fetched again", async () => {
    const { store, audio } = renderAlbumAndPlayer();
    play(first);
    server.use(
      http.get(`${API}/album/:id`, () => new HttpResponse(null, { status: 500 })),
    );

    fireEvent.error(audio);

    expect(await screen.findByText(FAILED)).toBeInTheDocument();
    expect(song(store).isPlaying).toBe(false);
    expect(song(store).track.preview).toBe(first.preview);
  });

  it("stops and says so when the track comes back without a preview", async () => {
    const { store, audio } = renderAlbumAndPlayer();
    play(first);
    answerAlbumWith({
      ...album,
      tracks: { data: [{ ...first, preview: "" }, second] },
    });

    fireEvent.error(audio);

    expect(await screen.findByText(FAILED)).toBeInTheDocument();
    expect(song(store).isPlaying).toBe(false);
    expect(song(store).track.preview).toBe(first.preview);
  });

  it("clears the message when another track is chosen", async () => {
    const { store, audio } = renderAlbumAndPlayer();
    play(first);
    server.use(
      http.get(`${API}/album/:id`, () => new HttpResponse(null, { status: 500 })),
    );
    fireEvent.error(audio);
    await screen.findByText(FAILED);

    play(second);

    expect(screen.queryByText(FAILED)).not.toBeInTheDocument();
    expect(song(store).isPlaying).toBe(true);
  });

  it("gets a fresh link again for a track that loaded, then failed later", async () => {
    const { store, audio } = renderAlbumAndPlayer();
    play(first);
    answerAlbumWith(withFreshLinks("one"));
    fireEvent.error(audio);
    await waitFor(() => expect(song(store).track.preview).toMatch(/one$/));

    // This link works...
    fireEvent.loadedMetadata(audio);
    // ...and, much later, has expired too.
    answerAlbumWith(withFreshLinks("two"));
    fireEvent.error(audio);

    await waitFor(() => expect(song(store).track.preview).toMatch(/two$/));
    expect(requestsTo(`/album/${album.id}`)).toBe(2);
    expect(song(store).loadFailed).toBe(false);
  });

  it("leaves a track chosen in the meantime alone", async () => {
    const { store, audio } = renderAlbumAndPlayer();
    play(first);
    server.use(
      http.get(`${API}/album/:id`, async () => {
        await delay(150);
        return HttpResponse.json(withFreshLinks());
      }),
    );
    fireEvent.error(audio);

    play(second);
    await waitFor(() => expect(requestsTo(`/album/${album.id}`)).toBe(1));
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)));

    expect(song(store).track.id).toBe(second.id);
    expect(song(store).track.preview).toBe(second.preview);
    expect(song(store).isPlaying).toBe(true);
  });
});

describe("the last track played", () => {
  it("is remembered by its ids", () => {
    renderAlbumAndPlayer();

    play(second);

    expect(JSON.parse(localStorage.getItem(LAST_TRACK))).toEqual({
      id: second.id,
      albumId: album.id,
    });
  });

  it("is loaded again on arrival, paused, with a link fetched now", async () => {
    localStorage.setItem(
      LAST_TRACK,
      JSON.stringify({ id: second.id, albumId: album.id }),
    );
    answerAlbumWith(withFreshLinks());
    const { store } = renderWithProviders(<Player />);

    expect(await screen.findByText(second.title)).toBeInTheDocument();
    expect(song(store).track.preview).toBe(`${second.preview}?fresh`);
    expect(song(store).isPlaying).toBe(false);
    expect(audioStub.playedSrcs).toEqual([]);
    expect(screen.getByRole("button", { name: "Play" })).toBeEnabled();
  });

  it("asks for nothing when no track is remembered", async () => {
    const { store } = renderWithProviders(<Player />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(requestsTo(`/album/${album.id}`)).toBe(0);
    expect(song(store).track).toEqual({});
  });

  it.each([
    ["something that is not JSON", "{not json"],
    ["an entry without ids", JSON.stringify({ title: "x" })],
  ])("ignores %s in storage", async (_name, stored) => {
    localStorage.setItem(LAST_TRACK, stored);
    const { store } = renderWithProviders(<Player />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(song(store).track).toEqual({});
    expect(screen.getByRole("button", { name: "Play" })).toBeDisabled();
    expect(requestLog).toEqual([]);
  });

  it("stays out of the way when its album is gone", async () => {
    localStorage.setItem(LAST_TRACK, JSON.stringify({ id: 1, albumId: 999 }));
    const { store } = renderWithProviders(<Player />);

    await waitFor(() => expect(requestsTo("/album/999")).toBe(1));
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
    expect(song(store).track).toEqual({});
  });

  it("does not replace a track the visitor has already started", async () => {
    localStorage.setItem(
      LAST_TRACK,
      JSON.stringify({ id: second.id, albumId: album.id }),
    );
    server.use(
      http.get(`${API}/album/:id`, async () => {
        await delay(150);
        return HttpResponse.json(album);
      }),
    );
    const { store } = renderAlbumAndPlayer();

    play(first);
    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));

    expect(song(store).track.id).toBe(first.id);
    expect(song(store).isPlaying).toBe(true);
  });
});

describe("a track Deezer has no preview for", () => {
  const silent = makeTrack(13, "No Preview", { preview: "" });
  const albumWithSilentFirst = {
    ...album,
    tracks: { data: [silent, ...album.tracks.data] },
  };

  it("has a disabled play button that says why", () => {
    const { store } = renderWithProviders(
      <>
        <TrackList album={albumWithSilentFirst} />
        <PlayerControls />
      </>,
    );
    const button = screen.getByRole("button", { name: "Play No Preview" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "No preview available");
    fireEvent.click(button);
    expect(song(store).track).toEqual({});
    expect(screen.getByRole("button", { name: `Play ${first.title}` })).toBeEnabled();
  });

  it("is never loaded into the player, whoever asks", () => {
    const dispatch = vi.fn();

    playOrToggle(dispatch, { isSameTrack: false, isPlaying: false, track: silent });

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("is skipped by the album page's own button, which plays the first track that has one", async () => {
    answerAlbumWith(albumWithSilentFirst);
    const { store } = renderWithProviders(
      <>
        <Routes>
          <Route path="/Album/:albumId" element={<AlbumPage />} />
        </Routes>
        <PlayerControls />
      </>,
      { route: `/Album/${album.id}` },
    );

    fireEvent.click(await screen.findByRole("button", { name: "Play Test Album" }));

    expect(song(store).track.id).toBe(first.id);
    expect(audioStub.playedSrcs).toEqual([first.preview]);
  });
});

describe("the position in the store", () => {
  it("is updated once a second, not on every frame", () => {
    const store = makeStore();
    const dispatch = vi.spyOn(store, "dispatch");
    const { container } = renderWithProviders(
      <>
        <TrackList album={album} />
        <PlayerControls />
      </>,
      { store },
    );
    const audio = container.querySelector("audio");
    const timeUpdates = () =>
      dispatch.mock.calls
        .map(([action]) => action)
        .filter((action) => action.type === "currentSong/setCurrentTime")
        .map((action) => action.payload);
    const frameAt = (seconds) => {
      Object.defineProperty(audio, "currentTime", {
        value: seconds,
        configurable: true,
      });
      act(() => audioStub.runFrames());
    };
    play(first);
    Object.defineProperty(audio, "duration", { value: 30, configurable: true });
    fireEvent.loadedMetadata(audio);

    for (const t of [1.1, 1.3, 1.5, 1.9]) frameAt(t);
    expect(timeUpdates()).toEqual([1]);

    for (const t of [2.0, 2.4, 3.2]) frameAt(t);
    expect(timeUpdates()).toEqual([1, 2, 3]);
    expect(store.getState().currentSong.currentTime).toBe(3);
  });
});
