import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const UserProfile = () => {
    const [editUsername, setEditUsername] = useState(false);
    const [editTele, setEditTele] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [tele, setTele] = useState('');
    const { user } = useAuthContext();
    const updateProfile = async (body) => {
        await fetch('/api/user/update', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        switch (e.target.id) {
            case 'edit-username':
                setUsername(e.target.children[1].value);
                setEditUsername(false);
                updateProfile({email, username, tele_id: tele});
                break;
            case 'edit-tele':
                setTele(e.target.children[1].value);
                setEditTele(false);
                updateProfile({email, username, tele_id: tele});
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: user.email})
            });
            const profile = await response.json();
            if (response.ok) {
                setUsername(profile.username);
                setEmail(profile.email);
                setTele(profile.tele_id);
                setIsLoading(false);
            }
        }

        if (user) {
            fetchProfile();
        }
    }, [user]);


    return ( 
        <div className='userprofile'>
            {isLoading && <div>Loading...</div>}
            {!isLoading && <div>
                <h1>User Profile</h1>
                <div className="profile">
                    {!editUsername && <h2><b>Username:</b> {username} <span className="material-symbols-outlined edit" onClick={() => window.confirm('Are you sure you want to change your username?') && setEditUsername(true)}>edit</span></h2>}
                    {editUsername && 
                    <div className='editProfile' >
                        <form  id='edit-username' onSubmit={handleSubmit}>
                            <label>Username: </label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <button className="material-symbols-outlined done">done</button>
                        </form>
                    </div>}
                    <h2><b>Email:</b> {email}</h2>
                    {!editTele && <h2><b>Telegram ID:</b> {tele} <span className="material-symbols-outlined edit" onClick={() => window.confirm('Are you sure you want to change your Telegram ID?') && setEditTele(true)}>edit</span></h2>}
                    {editTele && 
                    <div className='editProfile'>
                        <form id='edit-tele' onSubmit={handleSubmit}>
                            <label>Telegram ID: </label>
                            <input type="text" value={tele} onChange={(e) => setTele(e.target.value)}/>
                            <button className="material-symbols-outlined done">done</button>
                        </form>
                    </div>}
                </div>
            </div>}
        
        </div>
     );
}
 
export default UserProfile;