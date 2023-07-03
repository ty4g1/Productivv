import { useState } from "react";
import { useVerify } from "../hooks/useVerify";
import { useResend } from "../hooks/useResend";
import { useAuthContext } from "../hooks/useAuthContext";

const Verify = () => {
    const {user} = useAuthContext();
    const { verify, isLoading, error} = useVerify();
    const { resend, isLoading: isLoading_resend, message } = useResend();
    const [code, setCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verify(user.email, code);
    }

    const handleResend = async () => {
        await resend(user.email);
    }

    return ( 
        <div className="verification-form">
            <h2>Verify email</h2>
            <button onClick={handleResend} disabled={isLoading_resend}>Resend code</button>
            {message && <div className="message">{message}</div>}
            <form onSubmit={handleSubmit}>
                <label>Verification Code:</label>
                <input type="text" required onChange={(e) => setCode(e.target.value)} value={code}/>
                <button disabled={isLoading}>Verify</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
     );
}
 
export default Verify;