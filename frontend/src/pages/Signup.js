import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signup, isLoading, error} = useSignup();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
    }

    return ( 
        <div className="signup-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" required onChange={(e) => setEmail(e.target.value)} value={email}/>
                <label>Password:</label>
                <p>Must be over 8 characters long and include uppercase and lowercase letters, numbers, and a special character</p>
                <input type="password" required onChange={(e) => setPassword(e.target.value)} value={password}/>
                <button disabled={isLoading}>Sign Up</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
     );
}
 
export default Signup;