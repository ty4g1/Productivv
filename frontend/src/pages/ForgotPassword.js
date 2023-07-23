import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/user/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
            setEmail('');
        } else {
            setMessage(data.error);
        }
    }

    return ( 
        <div className="forgot-password">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email'/>
                    <button>Send reset instructions</button>
                </form>
                {message && <div className="message">{message}</div>}
            </div>
            
     );
}
 
export default ForgotPassword;