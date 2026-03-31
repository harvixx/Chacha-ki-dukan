import React, { useState } from 'react';
import { Mail, ShieldCheck, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import { usePassword } from '../hooks/usePassword';
import { useNavigate } from 'react-router-dom';
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
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stepVariants = {
    enter: (dir) => ({ opacity: 0, x: dir === 'forward' ? 40 : -40 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ opacity: 0, x: dir === 'forward' ? -40 : 40, transition: { duration: 0.25, ease: 'easeIn' } }),
};

const errorVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// --- Component ---
const VerifyOtp = () => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState('forward');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const navigate = useNavigate();
    const { handleSendOtp, handleVerifyOtp, loading, error } = usePassword();

    const goToStep2 = () => { setDirection('forward'); setStep(2); };
    const goToStep1 = () => { setDirection('backward'); setStep(1); };

    const onSendOtp = async (e) => {
        e.preventDefault();
        const success = await handleSendOtp(email);
        if (success) goToStep2();
    };

    const onVerifyOtp = async (e) => {
        e.preventDefault();
        await handleVerifyOtp(email, otp);
    };

    // Shared input style
    const inputStyle = {
        width: '100%',
        boxSizing: 'border-box',
        background: '#07090f',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '14px 20px',
        fontSize: '14px',
        color: '#ffffff',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    const btnStyle = (disabled) => ({
        width: '100%',
        padding: '15px',
        borderRadius: '16px',
        border: 'none',
        background: disabled ? '#1e293b' : '#2563eb',
        color: disabled ? '#475569' : '#ffffff',
        boxShadow: disabled ? 'none' : '0 8px 24px rgba(37,99,235,0.25)',
        fontSize: '14px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background 0.2s',
    });

    return (
        /*
         * ROOT FIX: position fixed + inset 0
         * min-h-screen scroll karata hai aur neeche white strip dikhata hai
         * fixed + inset: 0 = viewport ke barabar lock, koi scroll nahi
         */
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                overflow: 'hidden',
                userSelect: 'none',
            }}
        >
            {/* Background glows */}
            <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '420px', height: '420px',
                background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: 0, left: 0,
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            {/* Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '448px',
                    padding: '32px',
                    overflow: 'hidden',
                    borderRadius: '24px',
                    background: 'rgba(10, 12, 20, 0.95)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.05) inset',
                }}
            >
                {/* Top gradient bar */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)',
                }} />

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    onClick={() => step === 1 ? navigate('/login') : goToStep1()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: '28px', background: 'none', border: 'none',
                        cursor: 'pointer', color: '#64748b', padding: 0,
                        transition: 'color 0.2s', fontSize: '14px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                    <motion.span whileHover={{ x: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
                        <ArrowLeft size={17} color="currentColor" />
                    </motion.span>
                    <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {step === 1 ? 'लॉगिन पर वापस' : 'ईमेल बदलें'}
                    </span>
                </motion.button>

                {/* Step Content */}
                <div style={{ position: 'relative', overflow: 'hidden', minHeight: '320px' }}>
                    <AnimatePresence mode="wait" custom={direction}>

                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                onSubmit={onSendOtp}
                                style={{ position: 'absolute', width: '100%' }}
                            >
                                <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                    {/* Icon + Heading */}
                                    <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '8px' }}>
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                                            style={{
                                                width: '64px', height: '64px',
                                                background: 'rgba(37,99,235,0.1)',
                                                border: '1px solid rgba(59,130,246,0.2)',
                                                boxShadow: '0 0 24px rgba(59,130,246,0.15)',
                                                borderRadius: '16px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 20px',
                                            }}
                                        >
                                            <Mail color="#3b82f6" size={26} />
                                        </motion.div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                                            पासवर्ड भूल गए?
                                        </h2>
                                        <p style={{ marginTop: '6px', fontSize: '14px', color: '#94a3b8' }}>अपना ईमेल डालें, हम OTP भेजेंगे</p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b', fontWeight: 900, marginLeft: '4px' }}>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            required
                                            style={inputStyle}
                                            onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.45)')}
                                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <motion.button
                                            type="submit"
                                            disabled={loading || !email}
                                            whileHover={!loading && email ? { scale: 1.02 } : {}}
                                            whileTap={!loading && email ? { scale: 0.97 } : {}}
                                            style={btnStyle(loading || !email)}
                                        >
                                            {loading
                                                ? <Loader2 className="animate-spin" size={20} />
                                                : <><span>Send OTP</span><ChevronRight size={17} /></>
                                            }
                                        </motion.button>
                                    </motion.div>

                                </motion.div>
                            </motion.form>

                        ) : (

                            <motion.form
                                key="step2"
                                custom={direction}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                onSubmit={onVerifyOtp}
                                style={{ position: 'absolute', width: '100%' }}
                            >
                                <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                    {/* Icon + Heading */}
                                    <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '8px' }}>
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                                            style={{
                                                width: '64px', height: '64px',
                                                background: 'rgba(37,99,235,0.1)',
                                                border: '1px solid rgba(59,130,246,0.2)',
                                                boxShadow: '0 0 24px rgba(59,130,246,0.15)',
                                                borderRadius: '16px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 20px',
                                            }}
                                        >
                                            <ShieldCheck color="#3b82f6" size={26} />
                                        </motion.div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                                            OTP दर्ज करें
                                        </h2>
                                        <p style={{ marginTop: '6px', fontSize: '14px', color: '#94a3b8' }}>
                                            Sent to: <span style={{ color: '#60a5fa', fontWeight: 500 }}>{email}</span>
                                        </p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b', fontWeight: 900, textAlign: 'center' }}>
                                            Enter 6-Digit Code
                                        </label>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            placeholder="000000"
                                            required
                                            style={{
                                                ...inputStyle,
                                                textAlign: 'center',
                                                fontSize: '28px',
                                                fontWeight: 900,
                                                letterSpacing: '0.4em',
                                                padding: '16px 20px',
                                            }}
                                            onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.45)')}
                                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <motion.button
                                            type="submit"
                                            disabled={loading || otp.length < 6}
                                            whileHover={!loading && otp.length === 6 ? { scale: 1.02 } : {}}
                                            whileTap={!loading && otp.length === 6 ? { scale: 0.97 } : {}}
                                            style={btnStyle(loading || otp.length < 6)}
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify OTP'}
                                        </motion.button>
                                    </motion.div>

                                    <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
                                        <motion.button
                                            type="button"
                                            onClick={() => handleSendOtp(email)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase',
                                                fontSize: '11px', letterSpacing: '0.15em',
                                                transition: 'color 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
                                        >
                                            Resend OTP
                                        </motion.button>
                                    </motion.div>

                                </motion.div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Error */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            key="error"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{
                                padding: '12px', marginTop: '20px', borderRadius: '12px',
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)',
                            }}
                        >
                            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', textAlign: 'center', fontWeight: 500, margin: 0 }}>
                                {error}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default VerifyOtp;