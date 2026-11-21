import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router";
import App from "../App";
import AlbumPage from "../Components/Content/AlbumPage/AlbumPage";
import Artist from "../Components/Content/Artist/Artist";
import Home from "../Components/Content/Home/Home";
import Content from "../Components/Content/Content";
import BottomNavBar from "../Components/BottomNavBar/BottomNavBar";
import SideNavBar from "../Components/SideNavBar/SideNavBar";
import Player from "../Components/Player/Player";
import PlayerControls from "../Components/Player/PlayerControls/PlayerControls";
import Volume from "../Components/Player/Volume/Volume";
import Search from "../Components/Search/Search";
import { stubAudio } from "./audio";
import { album, artist, homeTracks, makeTrack } from "./fixtures";
import { makeStore } from "../redux/app/store";
import { renderWithProviders } from "./utils";

// Everything here is found the way a keyboard or screen-reader user finds
// it: by role and name, never by CSS class.

beforeEach(() => stubAudio());
afterEach(() => vi.restoreAllMocks());

const button = (name) => screen.getByRole("button", { name });
const loaded = (track) => ({
  currentSong: { track, isPlaying: false, duration: 0, currentTime: 0, volume: 0.5 },
});

describe("play buttons are real, named buttons", () => {
  it("names a home card's button after its track, and renames it while playing", async () => {
    const { store } = renderWithProviders(<Home />);
    const play = await screen.findByRole("button", { name: "Play First Song" });

    fireEvent.click(play);

    expect(store.getState().currentSong.track.id).toBe(homeTracks[0].id);
    expect(button("Pause First Song")).toBe(play);
    expect(button("Play Second Song")).toBeInTheDocument();
  });

  it("names the album page's button after the album and each row's after its track", async () => {
    const { store } = renderWithProviders(
      <Routes>
        <Route path="/Album/:albumId" element={<AlbumPage />} />
      </Routes>,
      { route: `/Album/${album.id}` }
    );

    expect(await screen.findByRole("button", { name: "Play Test Album" })).toBeInTheDocument();
    const row = button("Play Album Track Two");

    fireEvent.click(row);

    expect(store.getState().currentSong.track.id).toBe(12);
    expect(button("Pause Album Track Two")).toBe(row);
    // The page's own button now pauses too: a track of this album is playing.
    expect(button("Pause Test Album")).toBeInTheDocument();
  });

  it("marks the playing row, so its button stays visible without hover", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/Album/:albumId" element={<AlbumPage />} />
      </Routes>,
      { route: `/Album/${album.id}` }
    );
    const row = await screen.findByRole("button", { name: "Play Album Track One" });
    expect(row.closest(".table-row")).not.toHaveClass("is-playing");

    fireEvent.click(row);

    expect(row.closest(".table-row")).toHaveClass("is-playing");
    expect(button("Play Album Track Two").closest(".table-row")).not.toHaveClass("is-playing");
  });

  it("names the artist page's button after the artist and each top track's after the track", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/Artist/:artistId" element={<Artist />} />
      </Routes>,
      { route: `/Artist/${artist.id}` }
    );

    expect(await screen.findByRole("button", { name: `Play ${artist.name}` })).toBeInTheDocument();
    const rows = await screen.findAllByRole("button", { name: /^Play Top / });
    expect(rows.length).toBeGreaterThan(0);
  });
});

describe("the player bar", () => {
  it("has named buttons that are disabled until a track is loaded", () => {
    renderWithProviders(<PlayerControls />);

    for (const name of ["Play", "Back 5 seconds", "Forward 5 seconds"]) {
      expect(button(name)).toBeDisabled();
    }
  });

  it("enables them for a loaded track and renames Play to Pause while playing", () => {
    renderWithProviders(<PlayerControls />, {
      preloadedState: loaded(makeTrack(1, "Loaded")),
    });
    expect(button("Back 5 seconds")).toBeEnabled();
    expect(button("Forward 5 seconds")).toBeEnabled();

    fireEvent.click(button("Play"));

    expect(button("Pause")).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
  });

  it("labels the seek and volume sliders", () => {
    renderWithProviders(
      <>
        <PlayerControls />
        <Volume />
      </>
    );

    expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
  });

  it("is a named region whose cover link says where it goes", () => {
    renderWithProviders(<Player />, {
      preloadedState: loaded({
        id: 1,
        title: "Loaded",
        title_short: "Loaded",
        preview: "p.mp3",
        duration: 30,
        artist: { id: 10, name: "Test Artist" },
        album: { id: 100, title: "Test Album", cover_small: "s.jpg" },
      }),
    });

    const player = screen.getByRole("region", { name: "Player" });
    expect(
      within(player).getByRole("link", { name: "Go to album Test Album" })
    ).toHaveAttribute("href", "/Album/100");
  });
});

describe("images and icons", () => {
  it("gives every image an alt attribute and hides every icon", async () => {
    // The whole app, which brings its own router.
    const { container } = render(
      <Provider store={makeStore()}>
        <App />
      </Provider>
    );
    await screen.findByText(homeTracks[0].title);

    const images = [...container.querySelectorAll("img")];
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) expect(image).toHaveAttribute("alt");
    for (const icon of container.querySelectorAll("svg")) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("describes the album's cover", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/Album/:albumId" element={<AlbumPage />} />
      </Routes>,
      { route: `/Album/${album.id}` }
    );

    expect(await screen.findByRole("img", { name: "Cover of Test Album" })).toBeInTheDocument();
  });

  it("leaves one link per card to its album: the cover's is out of the tab order", async () => {
    renderWithProviders(<Home />);
    await screen.findByText(homeTracks[0].title);

    // By role, only the title's link is found, and no link is left nameless.
    const links = screen.getAllByRole("link", { name: "First Song" });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/Album/100");
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAccessibleName();
    }
  });
});

describe("landmarks and names in the shell", () => {
  it("has a main area and a navigation named Main", () => {
    renderWithProviders(
      <>
        <SideNavBar />
        <Content />
      </>,
      { route: "/library" }
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Nandotify home" })).toHaveAttribute("href", "/");
  });

  it("names the bottom bar's icon-only links", () => {
    renderWithProviders(<BottomNavBar />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const [name, href] of [["Home", "/"], ["Search", "/search"], ["Your Library", "/library"]]) {
      expect(within(nav).getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("labels the search box", () => {
    renderWithProviders(<Search />);

    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });
});

describe("the tab title", () => {
  const titleAt = async (route, text) => {
    renderWithProviders(<Content />, { route });
    await screen.findByText(text);
    return document.title;
  };

  it("is the bare site name at home", async () => {
    document.title = "something else";
    expect(await titleAt("/", homeTracks[0].title)).toBe("Nandotify");
  });

  it("names the artist", async () => {
    expect(await titleAt(`/Artist/${artist.id}`, "Popular")).toBe(`${artist.name} – Nandotify`);
  });

  it("names the album", async () => {
    expect(await titleAt(`/Album/${album.id}`, "Album Track One")).toBe("Test Album – Nandotify");
  });

  it("names the search page", async () => {
    expect(await titleAt("/search", "Explore")).toBe("Search – Nandotify");
  });

  it("names the library and not-found pages", async () => {
    expect(await titleAt("/library", "Create your first playlist")).toBe("Your Library – Nandotify");
    expect(await titleAt("/nope", "Page not found")).toBe("Page not found – Nandotify");
  });
});
