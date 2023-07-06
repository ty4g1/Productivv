import { useState, useEffect } from "react";
import { useSignup } from "../hooks/useSignup";
import jwt_decode from "jwt-decode";
import generator from 'generate-password-browser';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signup, isLoading, error} = useSignup();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password, false);
    }

    const handleCredentialResponse = async (response) => {
        console.log(response.credential);
        var userObject = jwt_decode(response.credential);
        console.log(userObject);
        var password = generator.generate({
            length: 20,
            numbers: true,
            symbols: true,
            uppercase: true,
            lowercase: true
        });
        console.log(userObject.email, password, true);
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
                <input type="email" required onChange={(e) => setEmail(e.target.value)} value={email}/>
                <label>Password:</label>
                <p>Must be over 8 characters long and include uppercase and lowercase letters, numbers, and a special character</p>
                <input type="password" required onChange={(e) => setPassword(e.target.value)} value={password}/>
                <button disabled={isLoading}>Sign Up</button>
                {error && <div className="error">{error}</div>}
            </form>
            <div id="signInDiv" style={{margin: '10px 60px'}}></div>
        </div>
     );
}
 
export default Signup;