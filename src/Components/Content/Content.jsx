import { Container } from "react-bootstrap";
import { Navigate, Route, Routes, useLocation } from "react-router";
import AlbumPage from "./AlbumPage/AlbumPage";
import Artist from "./Artist/Artist";
import Home from "./Home/Home";
import NotFound from "./NotFound/NotFound";
import YourLibrary from "../YourLibrary/YourLibrary";
import Search from "../Search/Search";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import "./Content.css";

const Content = () => {
  const { pathname } = useLocation();

  return (
    <Container className="Content p-0" fluid>
      {/* Keyed by address: going to another page clears a caught error. */}
      <ErrorBoundary key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/library" element={<YourLibrary />} />
          <Route path="/search" element={<Search />} />
          <Route path="/Artist/:artistId" element={<Artist />} />
          <Route path="/Album/:albumId" element={<AlbumPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default Content;
