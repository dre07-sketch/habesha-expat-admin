import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Loader2, KeyRound } from 'lucide-react';

export default function Forgot() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSent(true);
    }, 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0">
             {/* Deep Space Base */}
             <div className="absolute inset-0 bg-[#020617]"></div>
             
             {/* Moving Orbs */}
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-[pulse_8s_infinite]"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-[pulse_10s_infinite_reverse]"></div>
             
             {/* Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-40"></div>
        </div>

       <div className="w-full max-w-md z-10 relative px-4">
        
        {/* Main Glass Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-1 relative overflow-hidden group">
            
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[1.8rem] p-8 relative z-10">
                {/* Success State Overlay */}
                {isSent ? (
                     <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <CheckCircle className="text-emerald-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight mb-3">Email Sent!</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed max-w-xs mx-auto text-sm">
                            We've dispatched a secure recovery link to your inbox. It will expire in 15 minutes.
                        </p>
                        <Link to="/" className="w-full inline-flex items-center justify-center text-slate-950 bg-white hover:bg-slate-200 font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-white/10">
                             Back to Login
                        </Link>
                    </div>
                ) : (
                    /* Initial Form State */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 mb-6 shadow-xl relative group-hover:scale-105 transition-transform duration-300">
                                <KeyRound className="text-blue-400" size={28} />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full"></div>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Forgot Password?</h1>
                            <p className="text-slate-400 text-sm max-w-[260px] mx-auto">Enter your email and we'll send you instructions to reset your password.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Registered Email</label>
                                 <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner hover:bg-slate-950/80"
                                        placeholder="name@company.com" 
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group/btn"
                            >
                                <span className="relative z-10 flex items-center">
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Send Reset Link"}
                                    {!isSubmitting && <ArrowLeft className="ml-2 rotate-180 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        </form>
                        
                        <div className="mt-8 text-center pt-6 border-t border-white/5">
                            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white text-sm transition-colors group font-medium">
                                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
       </div>
       
       <div className="absolute bottom-6 text-slate-700 text-[10px] font-bold tracking-[0.2em] uppercase opacity-50">
            Secure Identity Service
       </div>
    </div>
  );
}