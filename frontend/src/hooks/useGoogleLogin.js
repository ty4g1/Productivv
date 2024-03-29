import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useGoogleLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {dispatch} = useAuthContext();
    const googleLogin = async (email) => {
        setisLoading(true);
        setError(null);

        const response = await fetch('/api/user/googlelogin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        });
        const json = await response.json();
        if (!response.ok) {
            setisLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            setisLoading(false);
            localStorage.setItem('user', JSON.stringify({...json, verified: true}));
            dispatch({type: 'LOGIN', payload: {...json, verified: true}});
        }
        

    }

    return { googleLogin, isLoading, error };
}