import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router";
import AlbumPage from "./AlbumPage/AlbumPage";
import Artist from "./Artist/Artist";
import Home from "./Home/Home";
import "./Content.css";
import YourLibrary from "../YourLibrary/YourLibrary";
import Search from "../Search/Search";

const Content = () => {
  return (
    <Container className="Content p-0" fluid>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/library" element={<YourLibrary />} />
        <Route exact path="/search" element={<Search />} />
        <Route path="/Artist/:artistId" element={<Artist />} />
        <Route path="/Album/:albumId" element={<AlbumPage />} />
      </Routes>
    </Container>
  );
};

export default Content;
