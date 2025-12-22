
import React from 'react';
import { ShieldEllipsis, AlertCircle, Info, HelpCircle } from 'lucide-react';

const SuspendedAccount: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative bg-[#05070a] font-sans selection:bg-habesha-gold/30 overflow-hidden">
      
      {/* Dynamic Glassmorphism Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-habesha-green/15 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-habesha-gold/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-habesha-red/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Animated Mesh Grid */}
        <div className="absolute inset-0 opacity-[0.04]" 
             style={{ backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.08) 1px, transparent 1px)`, backgroundSize: '80px 80px' }}>
        </div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Main Glass Content Wrapper */}
      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center justify-center gap-8 h-full max-h-[900px]">
        
        {/* The Master Glass Card */}
        <div className="relative w-full backdrop-blur-[40px] bg-white/[0.02] border border-white/10 rounded-[3rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in duration-1000">
          
          {/* Inner Glow Border */}
          <div className="absolute inset-0 rounded-[3rem] border border-white/5 pointer-events-none"></div>

          {/* Top Visual Accent Strip */}
          <div className="relative h-1.5 w-full bg-gradient-to-r from-habesha-green via-habesha-gold to-habesha-red opacity-40"></div>

          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
              
              {/* Left Side: Visual / Icon */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  {/* Orbiting Ring Animation */}
                  <div className="absolute -inset-6 border border-habesha-gold/20 rounded-full animate-spin-slow opacity-30"></div>
                  <div className="absolute -inset-3 border border-white/5 rounded-full animate-reverse-spin opacity-20"></div>
                  
                  <div className="relative w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-white/10 to-white/[0.01] border border-white/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform duration-500 hover:scale-105">
                     <ShieldEllipsis className="w-14 h-14 md:w-18 md:h-18 text-habesha-gold animate-pulse" strokeWidth={1} />
                     <div className="absolute -top-1 -right-1">
                        <div className="relative flex h-6 w-6 md:h-8 md:w-8">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-habesha-red opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-6 w-6 md:h-8 md:w-8 bg-habesha-red border-4 border-white/10 flex items-center justify-center">
                            <AlertCircle size={14} className="text-white" />
                          </span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Information */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-habesha-red/10 border border-habesha-red/20 text-habesha-red text-[10px] font-bold tracking-[0.2em] uppercase">
                    Security Lockdown
                  </span>
                  <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-[1.1]">
                    Access <span className="bg-clip-text text-transparent bg-gradient-to-r from-habesha-gold via-white to-habesha-gold animate-gradient-x">Paused</span>
                  </h1>
                </div>

                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                  Account is currently <span className="text-white font-medium italic underline decoration-habesha-gold/30 underline-offset-8">frozen</span> for a mandatory security review. Access is restricted to protect your digital assets.
                </p>

                {/* Status Panels in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-300">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-habesha-gold/60 block mb-2 font-mono">Current Status</span>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-habesha-gold rounded-full animate-pulse shadow-[0_0_12px_rgba(212,175,55,1)]"></div>
                      <span className="text-base text-white font-medium">Under Investigation</span>
                    </div>
                  </div>
                  <div className="p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-300">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-habesha-gold/60 block mb-2 font-mono">Tracking Vector</span>
                    <div className="flex items-center gap-3 text-white font-medium text-base">
                      <Info size={16} className="text-habesha-gold" />
                      <span>HE-X991-DELTA</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-2 text-gray-500 text-[13px]">
                   <div className="flex items-center gap-2">
                      <HelpCircle size={14} className="text-habesha-gold/60" />
                      <span>Origin: Login Anomaly.</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-habesha-gold/60" />
                      <span>ETA: 12-24h Review Window.</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Visual Data Strip */}
          <div className="px-10 py-5 bg-black/40 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 tracking-wider">
               <span className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-habesha-green rounded-full shadow-[0_0_8px_rgba(46,93,75,0.8)]"></div> 
                 HABESHA CORE
               </span>
               <div className="w-px h-3 bg-white/10"></div>
               <span className="uppercase tracking-[0.2em]">ADDIS ABABA</span>
            </div>
            
            <div className="text-white/20 text-[9px] tracking-[0.3em] uppercase">
              Integrity Hash: 0x82f...91a
            </div>
          </div>
        </div>

        {/* Global Footer Elements - Compact */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="flex items-center gap-8 text-white/30 text-[10px] font-semibold uppercase tracking-[0.4em]">
             <a href="#" className="hover:text-habesha-gold transition-all duration-300">Terms</a>
             <div className="w-1 h-1 bg-white/10 rounded-full"></div>
             <a href="#" className="hover:text-habesha-gold transition-all duration-300">Privacy</a>
             <div className="w-1 h-1 bg-white/10 rounded-full"></div>
             <a href="#" className="hover:text-habesha-gold transition-all duration-300">Support</a>
          </div>
          
          <div className="flex flex-col items-center gap-2">
             <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
             
          </div>
        </div>
      </div>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 20s linear infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SuspendedAccount;