import { Component } from 'react'
import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class SingleAlbum extends Component {
    state = {  }

    // componentDidMount
    render() { 
        return (  
            <>
            {/* {console.log(this.props.album)} */}
            <Col className='px-2 mb-4'>
                <Card style={{ width: '18rem' }}>
                    <Link to={'/Album/' + this.props.album.album.id}>
                        <Card.Img variant="top" src={this.props.album.album.cover_medium} />
                    </Link>
                    <div class="card-play"></div>
                    {/* <i class="fab fa-spotify"></i> */}
                    <Card.Body className='card-body text-center p-3'>
                        <Card.Title><h5>{this.props.album.album.title}</h5></Card.Title>
                        <Card.Text className='card-text'>
                            <Link to={'/Artist/' + this.props.album.artist.id}>
                                <p>{this.props.album.artist.name}</p>
                            </Link>
                        </Card.Text>
                        {/* <Button variant="primary">Go somewhere</Button> */}
                    </Card.Body>
                </Card>
            </Col>
            </>
                
        );
    }
}
 
export default SingleAlbum;