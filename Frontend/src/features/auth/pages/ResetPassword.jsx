import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { usePassword } from '../hooks/usePassword';
import { motion, AnimatePresence } from 'framer-motion';

// --- Animation Variants ---
const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const errorVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// --- Component ---
const ResetPassword = () => {
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [localError, setLocalError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const { handleResetPassword, loading, error } = usePassword();

    const email = location.state?.email;

    if (!email) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen p-6"
                style={{ background: '#000000' }}
            >
                <div className="space-y-4 text-center">
                    <p className="text-slate-500 font-hindi">सीधा प्रवेश वर्जित है! पहले OTP जांचें।</p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="text-xs tracking-widest text-blue-500 underline uppercase"
                    >
                        Go Back
                    </button>
                </div>
            </motion.div>
        );
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (passwords.new.length < 6) {
            setLocalError('Password kam se kam 6 characters ka hona chahiye!');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setLocalError('Passwords match nahi kar rahe hain!');
            return;
        }

        await handleResetPassword(email, passwords.new);
    };

    const combinedError = localError || error;

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center min-h-screen p-6"
            style={{ backgroundColor: '#000000' }}
        >
            {/* Background glow — fixed, behind everything */}
            <div
                className="fixed bottom-0 left-0 pointer-events-none -z-10"
                style={{
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />
            <div
                className="fixed top-0 right-0 pointer-events-none -z-10"
                style={{
                    width: '350px',
                    height: '350px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-md p-8 overflow-hidden rounded-3xl"
                style={{
                    background: 'rgba(10, 12, 20, 0.92)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.05) inset',
                    backdropFilter: 'none', // removed backdrop-blur to kill white strip
                }}
            >
                {/* Top gradient bar */}
                <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)',
                    }}
                />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Icon + Heading */}
                    <motion.div variants={itemVariants} className="mb-10 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                            className="flex items-center justify-center mx-auto mb-5 rounded-full"
                            style={{
                                width: '68px',
                                height: '68px',
                                background: 'rgba(37,99,235,0.12)',
                                border: '1px solid rgba(59,130,246,0.2)',
                                boxShadow: '0 0 30px rgba(59,130,246,0.18)',
                            }}
                        >
                            <KeyRound className="text-blue-400" size={28} />
                        </motion.div>

                        <h1
                            className="font-bold tracking-tight text-white font-hindi"
                            style={{ fontSize: '1.5rem', fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                        >
                            नया पासवर्ड चुनें
                        </h1>
                        <p className="mt-2 text-slate-500" style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                            Setting up for{' '}
                            <span className="text-blue-400">{email}</span>
                        </p>
                    </motion.div>

                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* New Password */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label
                                className="block ml-1 font-black text-slate-500"
                                style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full pr-12 text-sm text-white transition-all outline-none rounded-2xl"
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        background: '#07090f',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        padding: '14px 48px 14px 20px',
                                        fontSize: '14px',
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.45)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    whileTap={{ scale: 0.85 }}
                                    className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-600 hover:text-blue-400"
                                >
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label
                                className="block ml-1 font-black text-slate-500"
                                style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full text-sm text-white transition-all outline-none rounded-2xl"
                                placeholder="••••••••"
                                required
                                style={{
                                    background: '#07090f',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    padding: '14px 20px',
                                    fontSize: '14px',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.45)')}
                                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
                            />
                        </motion.div>

                        {/* Error */}
                        <AnimatePresence mode="wait">
                            {combinedError && (
                                <motion.div
                                    key="error"
                                    variants={errorVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="p-3 rounded-xl"
                                    style={{
                                        background: 'rgba(239,68,68,0.08)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                    }}
                                >
                                    <p
                                        className="font-bold text-center text-red-500"
                                        style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                                    >
                                        {combinedError}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.div variants={itemVariants}>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={!loading ? { scale: 1.02, backgroundColor: '#3b82f6' } : {}}
                                whileTap={!loading ? { scale: 0.97 } : {}}
                                className="flex items-center justify-center w-full gap-3 mt-2 font-bold transition-colors rounded-2xl"
                                style={{
                                    padding: '15px',
                                    background: loading ? '#1e293b' : '#2563eb',
                                    color: loading ? '#475569' : '#ffffff',
                                    boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.25)',
                                    fontSize: '14px',
                                }}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <CheckCircle2 size={17} />
                                        <span>Change Password</span>
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.p
                        variants={itemVariants}
                        className="mt-8 text-center text-slate-700"
                        style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                    >
                        Secured by Chacha's Firewall 🛡️
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ResetPassword;