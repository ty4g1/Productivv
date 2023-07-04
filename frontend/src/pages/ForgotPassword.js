const ForgotPassword = () => {
    return ( 
        <div className="forgot-password">
                <h2>Forgot Password</h2>
                <form>
                    <label>Email:</label>
                    <input type="email" required/>
                    <button>Send reset instructions</button>
                </form>
            </div>
            
     );
}
 
export default ForgotPassword;