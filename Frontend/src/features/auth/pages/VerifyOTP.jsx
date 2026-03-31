import React, { useState } from 'react';
import { Mail, ShieldCheck, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import { usePassword } from '../hooks/usePassword';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
    // UI State: 1 for Email, 2 for OTP
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();
    const { handleSendOtp, handleVerifyOtp, loading, error } = usePassword();

    // 1. Send OTP Logic
    const onSendOtp = async (e) => {
        e.preventDefault();
        const success = await handleSendOtp(email);
        if (success) setStep(2); // Email success hote hi OTP field dikhao
    };

    // 2. Verify OTP Logic
    const onVerifyOtp = async (e) => {
        e.preventDefault();
        // handleVerifyOtp internally navigate kar dega Reset Password page par
        await handleVerifyOtp(email, otp);
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 selection:bg-blue-500">
            {/* Background Glow */}
            <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 blur-[120px] -z-10"></div>
            
            <div className="relative w-full max-w-md p-8 overflow-hidden border shadow-2xl bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
                
                {/* Back Button */}
                <button 
                    onClick={() => step === 1 ? navigate('/login') : setStep(1)} 
                    className="flex items-center gap-2 mb-8 transition-colors text-slate-500 hover:text-blue-400 group"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> 
                    <span className="text-sm font-hindi">{step === 1 ? "लॉगिन पर वापस" : "ईमेल बदलें"}</span>
                </button>

                {/* --- STEP 1: SEND OTP --- */}
                {step === 1 && (
                    <form onSubmit={onSendOtp} className="space-y-6 duration-300 animate-in fade-in zoom-in">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                <Mail className="text-blue-500" size={28} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight font-hindi">पासवर्ड भूल गए?</h2>
                            <p className="mt-1 text-sm text-slate-400">अपना ईमेल डालें, हम OTP भेजेंगे</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0a0f1d] border border-white/5 rounded-2xl py-4 px-5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-800"
                                placeholder="name@example.com" 
                                required
                            />
                        </div>

                        <button 
                            disabled={loading || !email} 
                            className="flex items-center justify-center w-full gap-2 py-4 font-bold transition-all bg-blue-600 shadow-lg hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-2xl active:scale-95 shadow-blue-600/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Send OTP <ChevronRight size={18} /></>}
                        </button>
                    </form>
                )}

                {/* --- STEP 2: VERIFY OTP --- */}
                {step === 2 && (
                    <form onSubmit={onVerifyOtp} className="space-y-6 duration-300 animate-in slide-in-from-right">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                <ShieldCheck className="text-blue-500" size={28} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight font-hindi">OTP दर्ज करें</h2>
                            <p className="mt-1 text-sm text-slate-400">Sent to: <span className="font-medium text-blue-400">{email}</span></p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1 text-center block">Enter 6-Digit Code</label>
                            <input 
                                type="text" 
                                maxLength="6" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className="w-full bg-[#0a0f1d] border border-white/5 rounded-2xl py-4 text-center text-3xl font-black tracking-[0.4em] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                placeholder="000000" 
                                required
                            />
                        </div>

                        <button 
                            disabled={loading || otp.length < 6} 
                            className="flex items-center justify-center w-full gap-2 py-4 font-bold transition-all bg-blue-600 shadow-lg hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-2xl active:scale-95 shadow-blue-600/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
                        </button>

                        <div className="text-center">
                            <button 
                                type="button" 
                                onClick={() => handleSendOtp(email)} 
                                className="text-xs font-bold tracking-widest text-blue-500 uppercase transition-colors hover:text-blue-400"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

                {/* Error Logic */}
                {error && (
                    <div className="p-3 mt-6 border bg-red-500/10 border-red-500/20 rounded-xl animate-shake">
                        <p className="text-red-500 text-[11px] text-center font-medium uppercase tracking-wider">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyOtp;