import { useState, useEffect } from "react";
import { useSignup } from "../hooks/useSignup";
import jwt_decode from "jwt-decode";
import { useGoogleSignup } from "../hooks/useGoogleSignup";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [usingGoogle, setUsingGoogle] = useState(false); //this is a boolean that will be set to true if the user signs up with google
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); 
    const {signup, isLoading, error} = useSignup();
    const {googleSignup, isLoading: google_isLoading, error: google_error} = useGoogleSignup();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (usingGoogle) {
            await googleSignup(email, password, true);
        } else {
            await signup(email, password, false);
        }
    }

    const handleCredentialResponse = async (response) => {
        console.log(response.credential);
        var userObject = jwt_decode(response.credential);
        console.log(userObject);
        setEmail(userObject.email);
        setUsingGoogle(true);
        setMessage('Please enter a password to complete your account creation');
    }

    useEffect(() => {
        /*global google*/
        google.accounts.id.initialize({
            client_id: "631453125063-gp8v9uvrtgkmvo6vngo2f5n9igal4h58.apps.googleusercontent.com",
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
                <input type="email" required onChange={(e) => setEmail(e.target.value)} value={email} disabled={usingGoogle}/>
                <label>Password:</label>
                <p>Must be over 8 characters long and include uppercase and lowercase letters, numbers, and a special character</p>
                <input type="password" required onChange={(e) => setPassword(e.target.value)} value={password}/>
                <button disabled={isLoading || google_isLoading}>Sign Up</button>
                {error && <div className="error">{error}</div>}
                {google_error && <div className="error">{google_error}</div>}
                {message && <div className="message">{message}</div>}
            </form>
            <div id="signInDiv" style={{margin: '10px 60px'}}></div>
        </div>
     );
}
 
export default Signup;