import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resendEmail } from "../services/auth.api";

export const useVerify = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // 1. URL se email extract karna
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get("email");

    // 2. Success message ko auto-hide karne ke liye (Optional but Good UX)
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleResend = useCallback(async () => {
        if (!emailFromUrl) {
            setError("Email address is missing. Please try logging in again.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // POST request bhej raha hai (Kyuki humne auth.api update kiya tha)
            await resendEmail(emailFromUrl); 

            setSuccess(`Verification link sent to ${emailFromUrl}`);
        } catch (err) {
            const message = err.response?.data?.message || "Failed to resend email";
            setError(message);
            console.error("Resend Error:", err);
        } finally {
            setLoading(false);
        }
    }, [emailFromUrl]); // Dependency array mein emailFromUrl zaroori hai

    return {
        handleResend,
        loading,
        success,
        error,
        emailFromUrl,
    };
};