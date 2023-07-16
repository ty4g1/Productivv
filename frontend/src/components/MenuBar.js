import {Link} from 'react-router-dom';
const MenuBar = () => {
    return ( 
        <nav className='menubar'>
            <div className='menu-container'>
                <Link to='/'><span class="material-symbols-outlined" style={{color: 'white', fontSize: '1.5em'}}>receipt_long</span></Link>
                <Link to='/calendar'><span class="material-symbols-outlined" style={{color: 'white', fontSize: '1.5em'}}>calendar_month</span></Link>
                <Link to='/form-recurring'>Create Recurring Tasks</Link>
                <Link to='/completed'>Completed Tasks</Link>
                <Link to='/past-due'>Past Due Tasks</Link>
                <a class="telegram-button" href="https://t.me/ProductivvBot" target="_blank"><i></i><span>@ProductivvBot</span></a>
            </div>
        </nav>
     );
}
 
export default MenuBar;