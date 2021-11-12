// import logo from './logo.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import SideMenu from "./Components/sideMenu/SideMenu";
import Footer from "./Components/footer/Footer";
import Home from "./Components/Home";
import Artist from "./Components/Artist";
import AlbumPage from "./Components/AlbumPage";

function App() {
  return (
    // <div className="App">
    <Router>
      <Container fluid className="d-flex p-0">
        <SideMenu />
        <Route exact path="/" component={Home} />
        <Route path="/Artist/:artistId" component={Artist} />
        <Route path="/Album/:albumId" component={AlbumPage} />
        <Footer />
      </Container>
    </Router>

    // </div>
  );
}

export default App;
