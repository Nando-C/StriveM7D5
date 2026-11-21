import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, renderHook, screen, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { Link, Route, Routes } from "react-router";
import AlbumPage from "../Components/Content/AlbumPage/AlbumPage";
import Albums from "../Components/Content/Albums/Albums";
import Artist from "../Components/Content/Artist/Artist";
import Home from "../Components/Content/Home/Home";
import Popular from "../Components/Content/Popular/Popular";
import PlayerControls from "../Components/Player/PlayerControls/PlayerControls";
import Search from "../Components/Search/Search";
import { Provider } from "react-redux";
import { makeStore } from "../redux/app/store";
import { useGetAlbumQuery } from "../redux/api/deezerApi";
import { toPlayableTrack } from "../utils/track";
import { stubAudio } from "./audio";
import {
  album,
  artist,
  artistTopTracks,
  deezerError,
  homeTracks,
  otherAlbum,
  otherArtist,
  otherArtistAlbums,
  otherArtistTopTracks,
} from "./fixtures";
import { API, requestLog, requestsTo, server } from "./server";
import { renderWithProviders } from "./utils";

const ERROR = "There was an error retrieving the information";
const PAUSE_ICON = "M3 2h3v12H3zm7 0h3v12h-3z";

beforeEach(() => stubAudio());
afterEach(() => vi.restoreAllMocks());

// The artist and album pages behind their real routes, with links to move
// between two artists and two albums, and the player next to them.
const renderPages = (route) => {
  const view = renderWithProviders(
    <>
      <nav>
        <Link to={`/Artist/${artist.id}`}>to first artist</Link>
        <Link to={`/Artist/${otherArtist.id}`}>to other artist</Link>
        <Link to={`/Album/${album.id}`}>to first album</Link>
        <Link to={`/Album/${otherAlbum.id}`}>to other album</Link>
      </nav>
      <Routes>
        <Route path="/Artist/:artistId" element={<Artist />} />
        <Route path="/Album/:albumId" element={<AlbumPage />} />
      </Routes>
      <PlayerControls />
    </>,
    { route },
  );
  return {
    ...view,
    go: (name) => fireEvent.click(screen.getByText(`to ${name}`)),
    pageHeading: () => screen.queryByRole("heading", { level: 1 }),
    bigPlayButton: () => view.container.querySelector(".options .play-btn"),
    rowButtons: () => view.container.querySelectorAll(".table-row .play-btn"),
  };
};

const slowly = (body) => async () => {
  await delay(150);
  return HttpResponse.json(body);
};

describe("going back to a page", () => {
  it("shows an artist again from the cache, without a request", async () => {
    const { go, pageHeading } = renderPages(`/Artist/${artist.id}`);
    await screen.findByText("Top Ranked");
    await screen.findByText("Artist Album");
    expect([...requestLog].sort()).toEqual([
      "/artist/10",
      "/artist/10/albums",
      "/artist/10/top",
    ]);

    go("other artist");
    await screen.findByText("Other Hit");
    await screen.findByText("Other Artist Album");

    go("first artist");

    // Straight away: no loading state in between.
    expect(pageHeading()).toHaveTextContent(artist.name);
    expect(screen.getByText("Top Ranked")).toBeInTheDocument();
    expect(screen.getByText("Artist Album")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();

    await delay(50);
    expect(requestsTo("/artist/10")).toBe(1);
    expect(requestsTo("/artist/10/top")).toBe(1);
    expect(requestsTo("/artist/10/albums")).toBe(1);
    expect(requestLog).toHaveLength(6);
  });

  it("shows an album again from the cache, without a request", async () => {
    const { go } = renderPages(`/Album/${album.id}`);
    await screen.findByText("Album Track One");

    go("other album");
    await screen.findByText("Other Album Track");

    go("first album");

    expect(screen.getByText("Album Track One")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();

    await delay(50);
    expect(requestsTo("/album/100")).toBe(1);
    expect(requestLog).toHaveLength(2);
  });
});

describe("how long an unused result is kept", () => {
  const cached = (store) =>
    Object.values(store.getState().deezerApi.queries).map(
      (query) => query.endpointName,
    );

  it("keeps the home list as long as a page, and a search only a minute", async () => {
    const home = renderWithProviders(<Home />);
    await screen.findByText(homeTracks[0].title);
    const search = renderWithProviders(<Search />, { store: home.store });
    await screen.findByText("Result for i");
    expect(cached(home.store).sort()).toEqual(["getHomeTracks", "search"]);

    // Only the clock is faked, and only once nothing is on its way.
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
    try {
      home.unmount();
      search.unmount();

      vi.advanceTimersByTime(61_000);
      expect(cached(home.store)).toEqual(["getHomeTracks"]);

      vi.advanceTimersByTime(200_000);
      expect(cached(home.store)).toEqual(["getHomeTracks"]);

      vi.advanceTimersByTime(60_000);
      expect(cached(home.store)).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("the artist page's requests", () => {
  it("all start together, without waiting for the artist to arrive", async () => {
    server.use(http.get(`${API}/artist/10`, slowly(artist)));
    const { pageHeading } = renderPages(`/Artist/${artist.id}`);

    await waitFor(() => expect(requestLog).toHaveLength(3));

    expect(pageHeading()).toBeNull();
    expect([...requestLog].sort()).toEqual([
      "/artist/10",
      "/artist/10/albums",
      "/artist/10/top",
    ]);
    await waitFor(() => expect(pageHeading()).toHaveTextContent(artist.name));
    expect(await screen.findByText("Artist Album")).toBeInTheDocument();
    expect(requestLog).toHaveLength(3);
  });
});

describe("the hooks that take an id", () => {
  it("still pass on the rest of what RTK Query's hook returns", async () => {
    const store = makeStore();
    const { result } = renderHook(() => useGetAlbumQuery(album.id), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.data?.title).toBe(album.title));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(typeof result.current.refetch).toBe("function");
  });
});

describe("moving from one page to another of the same kind", () => {
  it("never shows the previous artist under the new artist's address", async () => {
    server.use(http.get(`${API}/artist/20`, slowly(otherArtist)));
    const { go, pageHeading } = renderPages(`/Artist/${artist.id}`);
    await screen.findByText("Top Ranked");

    go("other artist");

    expect(pageHeading()).toBeNull();
    expect(screen.queryByText("Top Ranked")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(pageHeading()).toHaveTextContent(otherArtist.name),
    );
  });

  it("never shows the previous artist's tracks or albums under the new artist", async () => {
    server.use(
      http.get(`${API}/artist/20/top`, slowly({ data: otherArtistTopTracks })),
      http.get(`${API}/artist/20/albums`, slowly({ data: otherArtistAlbums })),
    );
    const { go, pageHeading, bigPlayButton, store } = renderPages(
      `/Artist/${artist.id}`,
    );
    await screen.findByText("Top Ranked");
    await screen.findByText("Artist Album");

    go("other artist");
    await waitFor(() =>
      expect(pageHeading()).toHaveTextContent(otherArtist.name),
    );

    // The new artist is on screen; their lists are still on their way.
    expect(screen.queryByText("Top Ranked")).not.toBeInTheDocument();
    expect(screen.queryByText("Artist Album")).not.toBeInTheDocument();
    // And the play button must not start the previous artist's top track.
    fireEvent.click(bigPlayButton());
    expect(store.getState().currentSong.track).toEqual({});

    expect(await screen.findByText("Other Hit")).toBeInTheDocument();
    expect(await screen.findByText("Other Artist Album")).toBeInTheDocument();
  });

  it("never shows the previous album under the new album's address", async () => {
    server.use(http.get(`${API}/album/200`, slowly(otherAlbum)));
    const { go } = renderPages(`/Album/${album.id}`);
    await screen.findByText("Album Track One");

    go("other album");

    expect(screen.queryByText(album.title)).not.toBeInTheDocument();
    expect(screen.queryByText("Album Track One")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(await screen.findByText("Other Album Track")).toBeInTheDocument();
  });
});

// The pages unmount these lists while the page's own data loads, so the tests
// above cannot tell whether a list would hold on to the previous id's rows.
// Here each list stays mounted and is simply given another id.
describe("a list that is given another id while it stays mounted", () => {
  const Switcher = ({ ids, children }) => {
    const [id, setId] = useState(ids[0]);
    return (
      <>
        <button onClick={() => setId(ids[1])}>switch</button>
        {children(id)}
      </>
    );
  };
  const renderSwitching = (ids, children) => {
    renderWithProviders(<Switcher ids={ids}>{children}</Switcher>);
    return () => fireEvent.click(screen.getByText("switch"));
  };

  it("drops the previous artist's popular tracks", async () => {
    server.use(
      http.get(`${API}/artist/20/top`, slowly({ data: otherArtistTopTracks })),
    );
    const switchId = renderSwitching([artist.id, otherArtist.id], (id) => (
      <Popular artistId={id} />
    ));
    await screen.findByText("Top Ranked");

    switchId();

    expect(screen.queryByText("Top Ranked")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Other Hit")).toBeInTheDocument();
  });

  it("drops the previous artist's albums", async () => {
    server.use(
      http.get(`${API}/artist/20/albums`, slowly({ data: otherArtistAlbums })),
    );
    const switchId = renderSwitching([artist.id, otherArtist.id], (id) => (
      <Albums artistId={id} />
    ));
    await screen.findByText("Artist Album");

    switchId();

    expect(screen.queryByText("Artist Album")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Other Artist Album")).toBeInTheDocument();
  });
});

describe("an album card on the artist page", () => {
  it("gives an artist's album cards no play button, as an album is not a track", async () => {
    const { container } = renderWithProviders(<Albums artistId={artist.id} />);
    await screen.findByText("Artist Album");

    expect(container.querySelector(".AlbumCard")).not.toBeNull();
    expect(container.querySelector(".AlbumCard .play-btn")).toBeNull();
    // An album that comes with one cover size only: no choice to offer.
    const cover = container.querySelector(".AlbumCard img");
    expect(cover).toHaveAttribute("src", "http://localhost:3000/covers/300.jpg");
    expect(cover).not.toHaveAttribute("srcset");
    expect(cover).toHaveAttribute("loading", "lazy");
  });
});

describe("a Deezer error in a successful response", () => {
  it("shows the error state on the album page", async () => {
    renderPages("/Album/999");

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows the error state on the artist page", async () => {
    renderPages("/Artist/999");

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows the error state, not an endless loading state, for an empty response", async () => {
    server.use(
      http.get(
        `${API}/album/100`,
        () => new HttpResponse(null, { status: 200 }),
      ),
    );
    renderPages(`/Album/${album.id}`);

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows the error state on the search page", async () => {
    server.use(http.get(`${API}/search`, () => HttpResponse.json(deezerError)));
    renderWithProviders(<Search />);

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});

describe("the loaded track", () => {
  it("has the same shape whichever page it was started from", async () => {
    const [albumTrackOne, albumTrackTwo] = album.tracks.data;
    const topTrack = artistTopTracks.find(
      (track) => track.title === "Top Ranked",
    );
    const loaded = (store) => store.getState().currentSong.track;

    // A card on the home page.
    const home = renderWithProviders(
      <>
        <Home />
        <PlayerControls />
      </>,
    );
    await screen.findByText(homeTracks[0].title);
    fireEvent.click(home.container.querySelector(".AlbumCard .play-btn"));
    expect(loaded(home.store)).toEqual(toPlayableTrack(homeTracks[0]));
    home.unmount();

    // The album page: its large button, then a row.
    const albumPage = renderPages(`/Album/${album.id}`);
    await screen.findByText(albumTrackOne.title);
    fireEvent.click(albumPage.bigPlayButton());
    expect(loaded(albumPage.store)).toEqual(
      toPlayableTrack(albumTrackOne, album),
    );
    fireEvent.click(albumPage.rowButtons()[1]);
    expect(loaded(albumPage.store)).toEqual(
      toPlayableTrack(albumTrackTwo, album),
    );
    albumPage.unmount();

    // The artist page: its large button, then a row.
    const artistPage = renderPages(`/Artist/${artist.id}`);
    await screen.findByText(topTrack.title);
    fireEvent.click(artistPage.bigPlayButton());
    expect(loaded(artistPage.store)).toEqual(toPlayableTrack(topTrack));
    fireEvent.click(artistPage.rowButtons()[1]);
    expect(Object.keys(loaded(artistPage.store))).toEqual(
      Object.keys(toPlayableTrack(topTrack)),
    );
  });
});

describe("the album page's play button", () => {
  it("pauses a track of this album that was started from a row", async () => {
    const { store, bigPlayButton, rowButtons } = renderPages(
      `/Album/${album.id}`,
    );
    await screen.findByText("Album Track Two");
    fireEvent.click(rowButtons()[1]);
    expect(bigPlayButton().querySelector("path")).toHaveAttribute(
      "d",
      PAUSE_ICON,
    );

    fireEvent.click(bigPlayButton());

    // It toggled the track that was playing; it did not load the first one.
    expect(store.getState().currentSong.track.id).toBe(album.tracks.data[1].id);
    expect(store.getState().currentSong.isPlaying).toBe(false);
  });

  it("starts this album when a track of another album is playing", async () => {
    const { store, go, bigPlayButton } = renderPages(`/Album/${otherAlbum.id}`);
    await screen.findByText("Other Album Track");
    fireEvent.click(bigPlayButton());

    go("first album");
    await screen.findByText("Album Track One");
    expect(bigPlayButton().querySelector("path")).not.toHaveAttribute(
      "d",
      PAUSE_ICON,
    );
    fireEvent.click(bigPlayButton());

    expect(store.getState().currentSong.track.id).toBe(album.tracks.data[0].id);
    expect(store.getState().currentSong.isPlaying).toBe(true);
  });
});
