import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp, resetPassword } from '../services/auth.api'; // Check your api.js path

export const usePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /**
     * 1. Send OTP Request
     * Step: Forgot Password -> Verify OTP
     */
    const handleSendOtp = async (email) => {
        setLoading(true);
        setError('');
        try {
            const res = await sendOtp({ email });
            if (res.data.success) {
                // Success! Navigation hum component state se handle karenge 
                // ya resend ke liye true return karenge
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.message || "OTP bhejne mein dikat aayi!");
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 2. Verify OTP Request
     * Step: Verify OTP -> Reset Password Page
     */
    const handleVerifyOtp = async (email, otp) => {
        setLoading(true);
        setError('');
        try {
            const res = await verifyOtp({ email, otp });
            if (res.data.success) {
                // OTP verify hone par 'Reset Password' page par bhejo
                // Email ko state mein pass karna zaroori hai security ke liye
                navigate('/reset-password', { state: { email } });
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.message || "OTP galat hai ya expire ho gaya!");
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 3. Final Reset Password
     * Step: Reset Password -> Login Page
     */
    const handleResetPassword = async (email, newPassword) => {
        setLoading(true);
        setError('');
        try {
            const res = await resetPassword({ email, newPassword });
            if (res.data.success) {
                // Password change successful! Login par bhejo
                navigate('/login');
                return true;
            }
        } catch (err) {
            setError(err.response?.data?.message || "Password update fail ho gaya!");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSendOtp,
        handleVerifyOtp,
        handleResetPassword,
        loading,
        error,
        setError // Taaki UI se validation errors set kar sako
    };
};