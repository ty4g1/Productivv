import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {dispatch} = useAuthContext();
    const login = async (email, password) => {
        setisLoading(true);
        setError(null);

        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });
        const json = await response.json();
        console.log(json);
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

    return { login, isLoading, error };
}