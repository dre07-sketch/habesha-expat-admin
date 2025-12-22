import React from 'react';
import { Lock, Building2, Activity, Terminal, AlertTriangle } from 'lucide-react';

const AdminPanelShutdown: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#05070a] font-sans selection:bg-habesha-red/30 overflow-hidden p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-habesha-red/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-habesha-gold/5 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-habesha-green/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(rgba(166, 52, 52, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(166, 52, 52, 0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
      </div>
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center gap-8">
        <div className="w-full backdrop-blur-[40px] bg-white/[0.02] border border-white/10 rounded-[3rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-habesha-red via-habesha-gold to-habesha-red opacity-60"></div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              {/* Security Icon */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-10 border border-habesha-red/20 rounded-full animate-spin-slow opacity-30"></div>
                <div className="absolute -inset-6 border border-white/5 rounded-full animate-reverse-spin opacity-20"></div>
                <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-habesha-red/20 to-transparent border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl backdrop-blur-xl">
                  <Lock className="w-12 h-12 md:w-16 md:h-16 text-habesha-red animate-pulse-slow" strokeWidth={1} />
                  <div className="absolute -top-2 -right-2">
                    <div className="relative flex h-6 w-6 md:h-8 md:w-8">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-habesha-red opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 md:h-8 md:w-8 bg-habesha-red border-4 border-white/10 flex items-center justify-center">
                        <AlertTriangle size={14} className="text-white" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                    <span className="px-3 py-1 rounded-full bg-habesha-red/20 border border-habesha-red/30 text-habesha-red text-[10px] font-bold tracking-[0.3em] uppercase">
                      Protocol: DEFCON 1
                    </span>
                    <span className="flex items-center gap-2 text-habesha-gold text-[10px] font-mono tracking-widest opacity-60">
                      <Terminal size={14} /> SYSTEM_ROOT_OFFLINE
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white leading-[1.1]">
                    Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-habesha-red via-white to-habesha-red animate-gradient-x">Locked</span>
                  </h1>
                </div>

                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  The Administrative Hub is undergoing a <span className="text-white font-medium italic underline decoration-habesha-red/40 underline-offset-8">critical security synchronization</span>. All remote privileges are temporarily revoked.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center md:items-start gap-2">
                    <Building2 size={20} className="text-habesha-gold" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Realty Infrastructure</span>
                    <span className="text-white font-bold text-base">ESTATE_CORE_HUB_01</span>
                  </div>
                  <div className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center md:items-start gap-2">
                    <Activity size={20} className="text-habesha-green" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Network Security</span>
                    <span className="text-white font-bold text-base">ISOLATED MODE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 tracking-widest">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-habesha-red rounded-full shadow-[0_0_8px_rgba(166,52,52,1)] animate-pulse"></div> 
                SECURE_LOCKDOWN_ACTIVE
              </span>
              <div className="w-px h-3 bg-white/10 hidden md:block"></div>
              <span className="uppercase hidden md:block">Addis Ababa Datacenter</span>
            </div>
            <div className="text-white/20 text-[9px] tracking-[0.4em] uppercase font-bold">
              Verification Hash: 0xA991...X77
            </div>
          </div>
        </div>

        {/* Tech Footer */}
        <div className="flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-4">
            <img 
              src="https://z-cdn-media.chatglm.cn/files/f88235dd-b72f-4216-a1a1-88e18824c4c3.png?auth_key=1866410254-131775a622e14fe5ad1baddf9ec42812-0-f9ede7ba153932bc3559db0b23480523" 
              alt="t፭ch Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="text-[9px] font-mono text-white/20 leading-tight">
              SYSTEM_ID: ADMIN-LOCK-7292<br/>
              FIRMWARE: V4.2.0-STABLE
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminPanelShutdown;