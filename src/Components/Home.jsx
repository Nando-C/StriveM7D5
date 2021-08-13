import { Component } from 'react'
import { Col } from 'react-bootstrap'
import CardsDeck from './CardsDeck'
import Navbar from './NavBar'

class Home extends Component {
    state = {  }
    render() { 
        return (  
            <>
            <Col id='contentHome' md={10}>
                <Navbar />
                <CardsDeck />
            </Col>
            </>
        );
    }
}
 
export default Home;