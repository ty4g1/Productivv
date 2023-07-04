import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const ResetPassword = () => {
    const token = useParams().token;
    const { dispatch } = useAuthContext();
    const [error, setError] = useState('');
    const [user, setUser] = useState({});
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/reset/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const user = await response.json();
            if (response.ok) {
                console.log(user);
                if (!user) {
                    setError('Invalid token');
                } else {
                    setUser(user);
                }
            }
        }
        fetchUser();
    }, [token]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        console.log(user._id)
        const response = await fetch('/api/reset/pass', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password, _id: user._id})
        });
        const data = await response.json();
        if (response.ok) {
            dispatch({type: 'LOGIN', payload: {email: data.email, username: data.username, verified: data.verified, tele_id: data.tele_id}});
            setError('');
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(data.error);
        }
    }

    return ( 
        <div className="reset">
            <h2>Reset Password</h2>
            <p>Must be over 8 characters long and include uppercase and lowercase letters, numbers, and a special character</p>
            <form onSubmit={handleSubmit}>
                {console.log(Object.keys(user).length)}
                <label>New Password:</label>
                <input disabled={!user || !Object.keys(user).length} type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                <label>Confirm New Password:</label>
                <input disabled={!user || !Object.keys(user).length} type="password" required  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <button disabled={!user|| !Object.keys(user).length}>Reset Password</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
     );
}
 
export default ResetPassword;