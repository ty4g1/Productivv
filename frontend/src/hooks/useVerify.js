import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useVerify = () => {
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const {dispatch} = useAuthContext();
    const verify = async (email, code) => {
        setisLoading(true);
        setError(null);

        const response = await fetch('/api/user/verify', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, code})
        });
        const json = await response.json();
        if (!response.ok) {
            setisLoading(false);
            console.log(json.error);
            setError(json.error);
        }
        if (response.ok) {
            setisLoading(false);
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type: 'VERIFY', payload: json});
        }
        

    }

    return { verify, isLoading, error };
}