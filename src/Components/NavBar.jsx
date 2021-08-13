import { Component } from 'react'
import { Link } from 'react-router-dom'

class Navbar extends Component {
    state = {  }
    render() { 
        return (  
            <>
            <div className='my-4 pt-4' style={{zIndex:1}}>
                <ul className='nav nav-tabs justify-content-center'>
                    <li className='nav-item pr-1'>
                        <Link className='nav-link active' to=''><strong>TRENDING</strong></Link>
                    </li>
                    <li className='nav-item pr-1'>
                        <Link className='nav-link active' to=''><strong>PODCAST</strong></Link>
                    </li>
                    <li className='nav-item pr-1'>
                        <Link className='nav-link active' to=''><strong>MOODS AND GENERES</strong></Link>
                    </li>
                    <li className='nav-item pr-1'>
                        <Link className='nav-link active' to=''><strong>NEW RELEASES</strong></Link>
                    </li>
                    <li className='nav-item pr-1'>
                        <Link className='nav-link active' to=''><strong>DISCOVER</strong></Link>
                    </li>
                </ul>
            </div>
            
            </>
        );
    }
}
 
export default Navbar;