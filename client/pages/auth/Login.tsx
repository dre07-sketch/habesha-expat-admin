import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Loader2, Globe, Command, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.random() > 0.5 ? '99, 102, 241' : '139, 92, 246'}, ${Math.random() * 0.5 + 0.2})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles with lines
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/login/login-admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Particle Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* LEFT SIDE: Visual Brand Experience */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 z-10">
         {/* Deep rich gradient background */}
         <div className="absolute inset-0 bg-slate-950 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"></div>
            {/* Animated Blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         </div>

         <div className="relative z-10 max-w-lg">
             <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/20 animate-float ring-1 ring-white/20 backdrop-blur-md">
                <Globe className="text-white w-10 h-10" />
             </div>
             
             <h1 className="text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                Connect the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">Global Diaspora</span>
             </h1>
             
             <p className="text-blue-100/70 text-lg leading-relaxed mb-12 max-w-md">
                Orchestrate content, analyze engagement, and manage your community from the Habesha Expat command center.
             </p>

             <div className="flex gap-4">
                <div className="flex items-center px-5 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
                     <span className="text-sm font-medium text-slate-300">System Online</span>
                </div>
                 <div className="flex items-center px-5 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                     <ShieldCheck size={16} className="mr-2 text-blue-400" />
                     <span className="text-sm font-medium text-slate-300">Admin Access</span>
                </div>
             </div>
         </div>
      </div>

      {/* RIGHT SIDE: Glassmorphic Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative">
         {/* Background for Right Side */}
         <div className="absolute inset-0 bg-slate-900 overflow-hidden">
             {/* Dynamic Gradient Mesh */}
             <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] rounded-full bg-blue-900/20 blur-[100px] animate-pulse"></div>
             <div className="absolute bottom-[-50%] left-[-50%] w-[100%] h-[100%] rounded-full bg-indigo-900/20 blur-[100px] animate-pulse delay-1000"></div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
         </div>

         {/* Glass Card */}
         <div className="w-full max-w-[420px] relative z-20">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] p-8 sm:p-10 relative overflow-hidden group">
                 
                 {/* Shine Effect */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200 blur"></div>

                {/* Header */}
                 <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-white/10 mb-4 text-blue-400">
                        <Command size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Login</h2>
                    <p className="text-slate-400 text-sm">Enter your credentials to access the admin panel.</p>
                 </div>

                 {/* Error Display */}
                 {error && (
                   <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start">
                     <AlertCircle className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                     <p className="text-red-300 text-sm">{error}</p>
                   </div>
                 )}

                 <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-950/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-slate-950/60"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input 
                                type="password" 
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-950/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-slate-950/60"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex justify-end pt-1">
                             <button 
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors inline-block cursor-pointer hover:underline z-50 relative"
                             >
                                Forgot Password?
                             </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoggingIn}
                        className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                         <div className="relative flex items-center justify-center">
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>
                 </form>

                 <div className="mt-8 pt-6 border-t border-white/5 text-center">
                     <p className="text-slate-500 text-sm">
                        Need admin access? <a href="#" className="text-slate-300 hover:text-white font-medium transition-colors">Contact System Administrator</a>
                     </p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Login;