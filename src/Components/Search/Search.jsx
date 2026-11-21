import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useSearchQuery } from "../../redux/api/deezerApi";
import AlbumCard from "../Content/AlbumCard/AlbumCard";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./Search.css";

// Shown while the search box is empty, so the page isn't blank.
const PLACEHOLDER_QUERY = "i";
const DEBOUNCE_MS = 400;

const Search = () => {
  const [query, setQuery] = useState("");
  // The query the results are for: it follows the box after a pause in typing.
  const [searchedQuery, setSearchedQuery] = useState("");

  const trimmedQuery = query.trim();

  useEffect(() => {
    // The placeholder list loads straight away; typed queries are debounced.
    const timer = setTimeout(
      () => setSearchedQuery(trimmedQuery),
      trimmedQuery === "" ? 0 : DEBOUNCE_MS
    );
    return () => clearTimeout(timer);
  }, [trimmedQuery]);

  // `data` on purpose, not `currentData`: the previous results stay on screen
  // until the new ones arrive, so the grid does not blink on every search.
  // A response for an earlier query can never replace them, because the hook
  // only reports the result of the query it is given.
  const {
    data: albumList = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSearchQuery(searchedQuery || PLACEHOLDER_QUERY);

  // After a failed search, `data` still holds the results of some earlier
  // query. Those must not come back while the next search loads, so remember
  // how the last finished request ended and show the loading state instead.
  const [lastSearchFailed, setLastSearchFailed] = useState(false);
  if (!isFetching && lastSearchFailed !== isError) {
    setLastSearchFailed(isError);
  }
  const showLoading = isLoading || (isFetching && lastSearchFailed);

  return (
    <Container className="Search">
      <Row className="row-form">
        <Col sm={9} className="form-container">
          {/* Enter must not submit the form: that reloads the whole app. */}
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Control
              placeholder="Artists, songs, or podcasts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-icon">
              <span>
                <svg
                  role="img"
                  height="24"
                  width="24"
                  // class="Svg-sc-1bi12j5-0 gSLhUO _pxQadHFO3vmadLs8OPr"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.387 16.623A8.47 8.47 0 0019 10.5a8.5 8.5 0 10-8.5 8.5 8.454 8.454 0 005.125-1.73l4.401 5.153.76-.649-4.399-5.151zM10.5 18C6.364 18 3 14.636 3 10.5S6.364 3 10.5 3 18 6.364 18 10.5 14.636 18 10.5 18z"></path>
                </svg>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
      {showLoading && <h2 className="p-4">Loading...</h2>}
      {isError && <ErrorMessage onRetry={refetch} />}
      {!showLoading && !isError && (
        <>
          {trimmedQuery === "" && (
            <Row className="pt-3">
              <h2>Explore</h2>
            </Row>
          )}
          {/* Only once the answer for the typed query is in: while it loads,
              the list on screen still belongs to the query before it. */}
          {!isFetching && searchedQuery !== "" && albumList.length === 0 && (
            <h2 className="py-4">No results for "{searchedQuery}"</h2>
          )}
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 py-4">
            {albumList.map((album) => (
              <AlbumCard key={album.id} album={album} source="home" />
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Search;
