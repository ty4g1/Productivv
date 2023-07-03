import { useState } from "react";
import { useVerify } from "../hooks/useVerify";
import { useAuthContext } from "../hooks/useAuthContext";

const Verify = () => {
    const {user} = useAuthContext();
    const { verify, isLoading, error} = useVerify();
    const [code, setCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verify(user.email, code);
    }
    
    return ( 
        <div className="verification-form">
            <h2>Verify email</h2>
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