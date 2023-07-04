import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error} = useLogin();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    }
    return ( 
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" required onChange={(e) => setEmail(e.target.value)} value={email}/>
                <label>Password:</label>
                <input type="password" required onChange={(e) => setPassword(e.target.value)} value={password}/>
                <button disabled={isLoading}>Log in</button>
                <Link to='/forgot-password' style={{color: 'white', textDecoration: 'none'}}>Forgot password?</Link>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
     );
}
 
export default Login;