import { useState } from "react";

export const useResend = () => {
    const [message, setMessage] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const resend = async (email) => {
        setisLoading(true);
        setMessage(null);

        const response = await fetch('/api/user/resend', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        });
        const json = await response.json();
        if (!response.ok) {
            setisLoading(false);
            setMessage(json.error);
        }
        if (response.ok) {
            setisLoading(false);
            setMessage('Verification code sent to your email')
        }
    }

    return { resend, isLoading, message };
}