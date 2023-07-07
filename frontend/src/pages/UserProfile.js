import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

//import ranks
import bronze_4 from '../img/ranks/bronze/4.png'
import bronze_3 from '../img/ranks/bronze/3.png'
import bronze_2 from '../img/ranks/bronze/2.png'
import bronze_1 from '../img/ranks/bronze/1.png'
import silver_4 from '../img/ranks/silver/4.png'
import silver_3 from '../img/ranks/silver/3.png'
import silver_2 from '../img/ranks/silver/2.png'
import silver_1 from '../img/ranks/silver/1.png'
import gold_4 from '../img/ranks/gold/4.png'
import gold_3 from '../img/ranks/gold/3.png'
import gold_2 from '../img/ranks/gold/2.png'
import gold_1 from '../img/ranks/gold/1.png'


const UserProfile = () => {
    const [editUsername, setEditUsername] = useState(false);
    const [editTele, setEditTele] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [tele, setTele] = useState('');
    const [rank, setRank] = useState(null);
    const [title, setTitle] = useState('');
    const { user } = useAuthContext();
    const updateProfile = async (body) => {
        await fetch('/api/user/update', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
    };

    useEffect(() => {
        const assignRank = () => {
            if (user.points < 100) {
                setRank(bronze_4);
                setTitle('Bronze IV');
            } else if (user.points < 200) {
                setRank(bronze_3);
                setTitle('Bronze III');
            } else if (user.points < 300) {
                setRank(bronze_2);
                setTitle('Bronze II');
            } else if (user.points < 400) {
                setRank(bronze_1);
                setTitle('Bronze I');
            } else if (user.points < 500) {
                setRank(silver_4);
                setTitle('Silver IV');
            } else if (user.points < 600) {
                setRank(silver_3);
                setTitle('Silver III');
            } else if (user.points < 700) {
                setRank(silver_2);
                setTitle('Silver II');
            } else if (user.points < 800) {
                setRank(silver_1);
                setTitle('Silver I');
            } else if (user.points < 900) {
                setRank(gold_4);
                setTitle('Gold IV');
            } else if (user.points < 1000) {
                setRank(gold_3);
                setTitle('Gold III');
            } else if (user.points < 1100) {
                setRank(gold_2);
                setTitle('Gold II');
            } else {
                setRank(gold_1);
                setTitle('Gold I');
            }
        }
        if (user) {
            assignRank();
        }
    }, [user]);



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
            <div className="userInfo">
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
            <div className="rank">
                <img src={rank} alt={title}/>
                <h2>{title}</h2>
                <h3>{user.points} points</h3>
            </div>
        </div>
     );
}
 
export default UserProfile;