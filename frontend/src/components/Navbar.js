import {Link} from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
const Navbar = () => {
    const { logout } = useLogout();
    const { user, dispatch } = useAuthContext();
    const handleClick = () => {
        logout();
    }
    const handleClickDel = async () => {
        const response = await fetch(`/api/users/delete/${user.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        });
        const json = await response.json();
        if (response.ok) {
            localStorage.removeItem('user');
            dispatch({type: 'LOGOUT'});
        }
    }

    return ( 
        <nav className='navbar'>
            <div className="container">
                <Link to='/'>
                    <h1>Productivv</h1>
                </Link>
                <div className='auth-links'>
                    {user && user.verified && (
                    <div>
                        <span><Link to='/user-profile' style={{color: 'white'}}>User Profile</Link></span>
                        <button onClick={handleClick}>Log out</button>
                    </div>)}
                    {user && !user.verified && (
                        <div>
                            <button onClick={handleClickDel}>Cancel</button>
                        </div>
                    )}
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