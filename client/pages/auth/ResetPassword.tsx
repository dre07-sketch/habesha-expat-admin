import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. Get the email passed from the OTP Verification screen
    const { email } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State for inputs
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Redirect to login if someone tries to access this page directly without an email
    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    // Canvas Ref & Effect (Unchanged from your code)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const particles: any[] = [];
        for (let i = 0; i < 40; i++) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Client-side Validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // 2. Call the API
            const response = await fetch('http://localhost:5000/api/forget-password/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || "Failed to update password");
            }
        } catch (err) {
            console.error(err);
            setError("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0f172a] flex items-center justify-center overflow-hidden font-sans">
            
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[420px] mx-auto p-4">
                <div className="glass-panel p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/10 w-full bg-slate-900/60 backdrop-blur-xl relative overflow-hidden transition-all duration-500">
                    
                    {success ? (
                        <div className="text-center animate-fade-in py-4">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-full h-full bg-gradient-to-tr from-green-500/20 to-emerald-500/10 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                    <CheckCircle2 className="w-10 h-10 text-green-400 drop-shadow-md" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Password Updated</h3>
                            <p className="text-slate-400 text-sm mb-2">Your security has been restored.</p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-indigo-400 uppercase tracking-widest font-semibold">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                Redirecting to login...
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="mb-8 relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">New Credentials</h2>
                                <p className="text-slate-400 text-sm font-light">
                                    Resetting password for <span className='text-indigo-400 font-medium'>{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                            <Lock className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner hover:border-slate-700"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                                            <Lock className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Repeat password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner hover:border-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(79,70,229,0.5)] hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2 group mt-4 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Updating...
                                        </span>
                                    ) : (
                                        <>
                                            Update Password
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};