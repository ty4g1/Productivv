import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const handleClick = () => {
        logout();
    }
    return ( 
        <nav className='navbar'>
            <div className="container">
                <Link to='/'>
                    <h1>Productivv</h1>
                </Link>
                <div className='auth-links'>
                    {user && (
                    <div>
                        <span><Link to='/user-profile' style={{color: 'white'}}>User Profile</Link></span>
                        <button onClick={handleClick}>Log out</button>
                    </div>)}
                    {!user && (
                    <div>
                        <Link to='/login'>
                            <h1>Log in</h1>
                        </Link>
                        <Link to='/signup'>
                            <h1>Sign Up</h1>
                        </Link>
                    </div>)}
                    
                </div>
            </div>
        </nav>
     );
}
 
export default Navbar;