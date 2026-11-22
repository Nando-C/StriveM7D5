import { useEffect } from "react";

const SITE = "Nandotify";

// Sets the browser tab's title for the page that calls it. Pass nothing (or a
// name that has not loaded yet) for the bare site name.
export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} – ${SITE}` : SITE;
  }, [title]);
};
