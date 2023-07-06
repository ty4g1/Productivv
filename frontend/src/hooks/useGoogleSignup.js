import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGoogleSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {dispatch} = useAuthContext();
    const googleSignup = async (email, password, verified) => {
        setisLoading(true);
        setError(null);

        const response = await fetch('/api/user/googlesignup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const json = await response.json();
        if (!response.ok) {
            setisLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            setisLoading(false);
            localStorage.setItem('user', JSON.stringify({...json, verified}));
            dispatch({type: 'LOGIN', payload: {...json, verified}});
        }
        

    }

    return { googleSignup, isLoading, error };
}