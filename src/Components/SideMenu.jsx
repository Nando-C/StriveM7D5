import { Component } from 'react'
import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class SideMenu extends Component {
    state = {  }
    render() { 
        return (  
            <>
            <Col id='menu' className='px-2' md={2}>
                <div>
                    <Link to='/'>
                        <img className='img-fluid text-center mb-2 pr-3' src="./assets/spotify_black.png" alt="" />
                    </Link>
                </div>
            </Col>
            </>
        );
    }
}
 
export default SideMenu;