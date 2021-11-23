// import logo from './logo.svg';
// import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import SideNavBar from "./Components/SideNavBar/SideNavBar";
import Content from "./Components/Content/Content";
import Player from "./Components/Player/Player";
import BottomNavBar from "./Components/BottomNavBar/BottomNavBar";

function App() {
  return (
    // <div className="App">
    <Router>
      <Container fluid className="d-flex p-0">
        <SideNavBar />
        <Content />
        <Player />
        <BottomNavBar />
        {/* <Route exact path="/" component={Content} /> */}
        {/* <Route path="/Artist/:artistId" component={Artist} /> */}
        {/* <Route path="/Album/:albumId" component={AlbumPage} /> */}
      </Container>
    </Router>

    // </div>
  );
}

export default App;
