import {Link} from 'react-router-dom';
const MenuBar = () => {
    return ( 
        <nav>
            <div className='menu-container'>
                <Link to='/calendar'>Calendar</Link>
                <Link to='/'>Home</Link>
            </div>
        </nav>
     );
}
 
export default MenuBar;