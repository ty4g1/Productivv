import {Link} from 'react-router-dom';
const MenuBar = () => {
    return ( 
        <nav>
            <div className='menu-container'>
                <Link to='/'><span class="material-symbols-outlined" style={{color: 'white', fontSize: '1.5em'}}>home</span></Link>
                <Link to='/calendar'><span class="material-symbols-outlined" style={{color: 'white', fontSize: '1.5em'}}>calendar_month</span></Link>
            </div>
        </nav>
     );
}
 
export default MenuBar;