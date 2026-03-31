import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { usePassword } from '../hooks/usePassword';

const ResetPassword = () => {
    const [passwords, setPasswords] = useState({ new: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [localError, setLocalError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const { handleResetPassword, loading, error } = usePassword();

    // OTP Verify page se email state mein aana chahiye
    const email = location.state?.email;

    // Security: Agar koi direct URL se is page par aaye bina email ke, toh wapas bhej do
    if (!email) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6 bg-black">
                <div className="space-y-4 text-center">
                    <p className="text-slate-500 font-hindi">सीधा प्रवेश वर्जित है! पहले OTP जांचें।</p>
                    <button onClick={() => navigate('/forgot-password')} className="text-xs tracking-widest text-blue-500 underline uppercase">Go Back</button>
                </div>
            </div>
        );
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (passwords.new.length < 6) {
            setLocalError("Password kam se kam 6 characters ka hona chahiye!");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setLocalError("Passwords match nahi kar rahe hain!");
            return;
        }

        await handleResetPassword(email, passwords.new);
        // Success hone par usePassword hook khud navigate('/login') kar dega
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6">
            {/* Background Glow */}
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] -z-10"></div>
            
            <div className="relative w-full max-w-md p-8 overflow-hidden border shadow-2xl bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
                
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>

                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
                        <KeyRound className="text-blue-400" size={30} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight font-hindi">नया पासवर्ड चुनें</h1>
                    <p className="text-slate-500 text-[11px] uppercase tracking-widest mt-2">Setting up password for <span className="text-blue-400">{email}</span></p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* New Password Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">New Password</label>
                        <div className="relative">
                            <input 
                                type={showPass ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                className="w-full bg-[#0a0f1d] border border-white/5 rounded-2xl py-4 px-5 focus:border-blue-500/50 outline-none transition-all pr-12 text-sm"
                                placeholder="••••••••"
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPass(!showPass)}
                                className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-600 hover:text-blue-400"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Confirm Password</label>
                        <input 
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full bg-[#0a0f1d] border border-white/5 rounded-2xl py-4 px-5 focus:border-blue-500/50 outline-none transition-all text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Error Feedback */}
                    {(localError || error) && (
                        <div className="p-3 border bg-red-500/10 border-red-500/20 rounded-xl">
                            <p className="text-red-500 text-[10px] text-center font-bold uppercase tracking-wider">{localError || error}</p>
                        </div>
                    )}

                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 py-4 rounded-2xl font-bold flex justify-center items-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                <CheckCircle2 size={18} />
                                <span>Change Password</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
                    Secured by Chacha's Firewall 🛡️
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;