const ResetPassword = () => {
    return ( 
        <div className="reset">
            <h2>Reset Password</h2>
            <p>Must be over 8 characters long and include uppercase and lowercase letters, numbers, and a special character</p>
            <form>
                <label>New Password:</label>
                <input type="password" required />
                <label>Confirm New Password:</label>
                <input type="password" required />
                <button>Reset Password</button>
            </form>
        </div>
     );
}
 
export default ResetPassword;