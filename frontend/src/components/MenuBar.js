import {Link} from 'react-router-dom';
const MenuBar = () => {
    return ( 
        <nav className='menubar'>
            <div className='menu-container'>
                <Link to='/'><span class="material-symbols-outlined" style={{color: 'white', fontSize: '1.5em'}}>receipt_long</span></Link>
                <Link to='/calendar'><span class="material-symbols-outlined" style={{color: 'white', fontSize: '1.5em'}}>calendar_month</span></Link>
                <Link to='/form-recurring'>Create Recurring Tasks</Link>
            </div>
        </nav>
     );
}
 
export default MenuBar;