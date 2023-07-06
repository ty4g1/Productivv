import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import jwt_decode from "jwt-decode";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error} = useLogin();
    const { googleLogin, isLoading: google_isLoading, error: google_error } = useGoogleLogin();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    }

    const handleCredentialResponse = async (response) => {
        console.log(response.credential);
        var userObject = jwt_decode(response.credential);
        await googleLogin(userObject.email);
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
        
        google.accounts.id.prompt();
    }, []);

    return ( 
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" required onChange={(e) => setEmail(e.target.value)} value={email}/>
                <label>Password:</label>
                <input type="password" required onChange={(e) => setPassword(e.target.value)} value={password}/>
                <button disabled={isLoading || google_isLoading}>Log in</button>
                <Link to='/forgot-password' style={{color: 'white', textDecoration: 'none'}}>Forgot password?</Link>
                {google_error && <div className="error">{google_error}</div>}
                {error && <div className="error">{error}</div>}
            </form>
            <div id="signInDiv" style={{margin: '10px auto'}}></div>
        </div>
     );
}
 
export default Login;