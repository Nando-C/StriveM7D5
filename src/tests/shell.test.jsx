import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import Content from "../Components/Content/Content";
import SideNavBar from "../Components/SideNavBar/SideNavBar";
import BottomNavBar from "../Components/BottomNavBar/BottomNavBar";
import { API, server } from "./server";
import { renderWithProviders } from "./utils";

afterEach(() => vi.restoreAllMocks());

describe("routes", () => {
  it("shows a not-found page, with a way home, for an unknown address", () => {
    renderWithProviders(<Content />, { route: "/nope/thing" });

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toHaveAttribute("href", "/");
  });

  it("shows the home page at /", async () => {
    renderWithProviders(<Content />, { route: "/" });

    expect(await screen.findByText("Recommended for today")).toBeInTheDocument();
  });

  it("still answers the old /home address with the home page", async () => {
    renderWithProviders(<Content />, { route: "/home" });

    expect(await screen.findByText("Recommended for today")).toBeInTheDocument();
    expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
  });
});

describe("a page that throws while rendering", () => {
  it("shows a message in place of the page", async () => {
    // React reports the caught error on the console; keep the output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
    // An album without the fields the page reads.
    server.use(
      http.get(`${API}/album/:id`, () =>
        HttpResponse.json({ id: 100, title: "Broken" })
      )
    );
    renderWithProviders(<Content />, { route: "/Album/100" });

    expect(
      await screen.findByText("Something went wrong showing this page")
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toHaveAttribute("href", "/");
  });
});

describe.each([
  ["side", SideNavBar],
  ["bottom", BottomNavBar],
])("the %s navigation bar", (_name, NavBar) => {
  const link = (container, href) => container.querySelector(`a.nav-link[href="${href}"]`);

  it("marks Home as the current page at /", () => {
    const { container } = renderWithProviders(<NavBar />, { route: "/" });

    expect(link(container, "/")).toHaveClass("active");
    expect(link(container, "/search")).not.toHaveClass("active");
  });

  it("marks only Search as the current page at /search", () => {
    const { container } = renderWithProviders(<NavBar />, { route: "/search" });

    expect(link(container, "/search")).toHaveClass("active");
    expect(link(container, "/")).not.toHaveClass("active");
  });
});
