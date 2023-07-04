import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {dispatch} = useAuthContext();
    const signup = async (email, password) => {
        setisLoading(true);
        setError(null);

        const response = await fetch('/api/user/signup', {
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
            localStorage.setItem('user', JSON.stringify({...json, verified: false}));
            dispatch({type: 'LOGIN', payload: {...json, verified: false}});
        }
        

    }

    return { signup, isLoading, error };
}