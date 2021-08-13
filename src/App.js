// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Row } from 'react-bootstrap'
import SideMenu from './Components/SideMenu'
import Footer from './Components/Footer'
import Home from './Components/Home'
import Artist from './Components/Artist'
import AlbumPage from './Components/AlbumPage'

function App() {
  return (
    // <div className="App">
      <Router>
        <Row>
          <SideMenu />
          <Route exact path='/' component={Home} />
          <Route path='/Artist/:artistId' component={Artist} />
          <Route path='/Album/:albumId' component={AlbumPage} />
        </Row>
        <Footer />
      </Router>
     
    // </div>
  );
}

export default App;
