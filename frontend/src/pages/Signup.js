import { useState, useEffect } from "react";
import { useSignup } from "../hooks/useSignup";
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signup, isLoading, error} = useSignup();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
    }

    const handleCredentialResponse = (response) => {
        console.log(response);
    }

    useEffect(() => {
        /*global google*/
        google.accounts.id.initialize({
            client_id: "1000000000000-abc123def456.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {
                theme: "outline",
                size: "large"
            }
        );
    }, []);

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
            </form><br></br>
            <div id="signInDiv"></div>
        </div>
     );
}
 
export default Signup;