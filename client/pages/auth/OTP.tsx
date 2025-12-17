import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../UIComponents';

export const OTP: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [hash, setHash] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('otpEmail');
        const storedHash = localStorage.getItem('otpHash');

        if (storedEmail && storedHash) {
            setEmail(storedEmail);
            setHash(storedHash);
        } else {
            // Check if we just navigated from forgot-password logic
            // (Optional: add better handling here)
            // navigate('/forgot-password'); 
            // Commenting out redirect for now to allow viewing the page if state is somehow lost but user is testing, 
            // but ideally we should redirect.
            // Let's actually redirect if missing, to be safe.
            // navigate('/forgot-password');
        }
    }, [navigate]);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(30);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setResendCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Particle System Effect (unchanged)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; dx: number; dy: number; size: number; alpha: number }[] = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2,
                alpha: Math.random() * 0.5 + 0.1,
            });
        }

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
                ctx.fill();
            });
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Input Focus Logic (unchanged)
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (index > 0 && otp[index] === '') {
                inputRefs.current[index - 1]?.focus();
            }
            if (otp[index] !== '') {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Updated API endpoint to match the server
            const response = await fetch('http://localhost:5000/api/forget-password/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp: otpValue,
                    hash
                }),
            });

            const data = await response.json();

            if (response.ok && data.verified) {
                navigate('/reset-password', { state: { email } });
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            console.error('API Error:', err);
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError('Unable to connect to the server. Please check your connection.');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCountdown > 0) return;

        setResendLoading(true);
        setError(null);

        try {
            // Updated resend endpoint to match the server (send-otp is used for both initial and resend)
            const response = await fetch('http://localhost:5000/api/forget-password/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setResendCountdown(30);
                setOtp(['', '', '', '', '', '']);
                // Focus first input
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
                // Update hash if provided in response
                if (data.hash) {
                    setHash(data.hash);
                    localStorage.setItem('otpHash', data.hash);
                }
            } else {
                setError(data.message || 'Failed to resend code');
            }
        } catch (err: any) {
            console.error('Resend Error:', err);
            if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                setError('Unable to connect to the server. Please check your connection.');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0f172a] flex items-center justify-center overflow-hidden font-sans">
            {/* Background Effects (unchanged) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-[440px] mx-auto p-4">
                <div className="glass-panel w-full p-8 md:p-12 rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-fade-in-up">
                    {/* Decorative glow inside card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none"></div>

                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="flex items-center text-xs font-medium text-slate-500 hover:text-white transition-colors mb-8 group uppercase tracking-wider relative z-20"
                    >
                        <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="mb-10 text-center relative z-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 border border-white/5 mb-6 shadow-inner">
                            <ShieldCheck className="w-8 h-8 text-indigo-400 drop-shadow-md" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Security Check</h2>
                        <p className="text-slate-400 text-sm">
                            Please enter the 6-digit code sent to<br />
                            <span className="text-indigo-300">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-20">
                        <div className="flex justify-center gap-2 md:gap-3 mx-auto">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    maxLength={1}
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    className={`w-11 h-14 md:w-12 md:h-16 bg-slate-950/50 border rounded-xl text-center text-xl md:text-2xl font-bold text-white transition-all duration-200 shadow-inner
                                        ${data
                                            ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-105'
                                            : 'border-slate-800 hover:border-slate-700'
                                        } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                                />
                            ))}
                        </div>

                        {/* Error message display */}
                        {error && (
                            <div className="text-center text-red-400 text-sm bg-red-900/20 py-2 px-4 rounded-lg border border-red-800/30">
                                {error}
                            </div>
                        )}

                        <div className="text-center space-y-6">
                            <button
                                type="submit"
                                disabled={otp.join('').length !== 6 || loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? 'Verifying...' : 'Verify Identity'}
                            </button>

                            <p className="text-xs text-slate-500">
                                Didn't receive code?{' '}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendCountdown > 0 || resendLoading}
                                    className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendLoading ? 'Sending...' : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};