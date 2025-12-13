import React, { useEffect, useState } from 'react';
import {
  ShieldBan,
  Database,
  Cpu,
  Globe,
  Lock
} from 'lucide-react';

const AdminPanelShutdown: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [hexStream, setHexStream] = useState<string[]>([]);
  const [glitch, setGlitch] = useState(false);

  // Random Glitch Effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.92) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Hex Stream Effect
  useEffect(() => {
    const chars = '0123456789ABCDEF';
    const interval = setInterval(() => {
      const line = Array(8).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)]).join(' ');
      setHexStream(prev => [line, ...prev.slice(0, 15)]);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Fake Maintenance Progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (Math.random() * 3);
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Terminal Logs with Habesha Context
  useEffect(() => {
    const logs = [
      "SYSTEM_CORE: INITIATING SHUTDOWN...",
      "ADDIS_NODE: DISCONNECTED",
      "USER_DB: ENCRYPTING SHARDS...",
      "MEMBER_SESSION: TERMINATED",
      "SECURE_GATEWAY: LOCKED",
      "VERIFYING INTEGRITY HASHE...",
      "BACKUP_SERVER: SYNCHRONIZING...",
      "FIREWALL: MAXIMUM OPACITY",
      "ADMIN_AUTH_TOKEN: REVOKED",
      "PROTOCOL_RED: ACTIVE"
    ];
    let i = 0;
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setTerminalLines(prev => [`[${timestamp}] ${logs[i % logs.length]}`, ...prev.slice(0, 7)]);
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-black text-red-600 font-mono overflow-hidden relative selection:bg-red-900 selection:text-white transition-transform duration-75 ${glitch ? 'translate-x-[2px] skew-x-1' : ''}`}>

      {/* CSS for scanlines and CRT flicker */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanline {
          animation: scanline 8s linear infinite;
        }
        .hazard-stripe {
          background: repeating-linear-gradient(
            45deg,
            #7f1d1d,
            #7f1d1d 10px,
            #000000 10px,
            #000000 20px
          );
        }
      `}</style>

      {/* CRT Monitor Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent scanline h-full w-full opacity-50"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        {/* Hex Grid Pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%237f1d1d' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}>
        </div>
        {/* Radar Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/20 to-transparent animate-spin-slow origin-bottom-right opacity-50"></div>
      </div>

      {/* Red Alert Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-900/30 to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-900/30 to-transparent animate-pulse"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col p-4 md:p-8 lg:p-12">

        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-red-800 pb-6 mb-8 relative">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 animate-pulse"></div>

          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="relative">
              <ShieldBan className="w-12 h-12 text-red-500 animate-pulse" />
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-40 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic transform -skew-x-12" style={{ textShadow: '4px 4px 0px #7f1d1d' }}>
                System<span className="text-red-600">Offline</span>
              </h1>
              <div className="flex items-center gap-2 text-xs md:text-sm tracking-[0.3em] text-red-400 font-bold mt-1">
                HABESHA EXPAT // ADMIN CONSOLE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-red-500/70 uppercase tracking-widest">Security Level</span>
              <span className="text-xl font-bold text-white bg-red-600 px-3 py-1 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
                DEFCON 1
              </span>
            </div>
            <div className="hidden lg:block w-px h-12 bg-red-900/50"></div>
            <div className="hidden lg:flex flex-col items-end text-xs text-red-400/60 font-mono">
              <span>LAT: 9.005401 N</span>
              <span>LNG: 38.763611 E</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Column: Diagnostics */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Status Box */}
            <div className="bg-black/80 border-2 border-red-900/50 p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 bg-red-900/50 text-[10px] text-white">CPU_01</div>
              <div className="flex items-end justify-between mb-2 mt-2">
                <Cpu className="text-red-500" size={20} />
                <span className="text-2xl font-bold text-white">98%</span>
              </div>
              <div className="w-full bg-red-900/20 h-2">
                <div className="h-full bg-red-600 animate-pulse" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="bg-black/80 border-2 border-red-900/50 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 bg-red-900/50 text-[10px] text-white">MIGRATE</div>
              <div className="flex items-end justify-between mb-2 mt-2">
                <Database className="text-red-500" size={20} />
                <span className="text-2xl font-bold text-white">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full bg-red-900/20 h-2">
                <div className="h-full bg-yellow-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="bg-black/80 border-2 border-red-900/50 p-4 flex-1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 bg-red-900/50 text-[10px] text-white">NET_TOPOLOGY</div>
              <div className="flex-1 flex items-center justify-center relative my-4">
                <Globe className="text-red-900 animate-spin-slow w-32 h-32 opacity-50 absolute" />
                <div className="grid grid-cols-2 gap-2 relative z-10 w-full">
                  <div className="text-center">
                    <div className="text-[10px] text-red-500">ADDIS</div>
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto animate-ping"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-red-500">DUBAI</div>
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-red-500">LONDON</div>
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-red-500">DC</div>
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto animate-ping" style={{ animationDelay: '0.8s' }}></div>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-red-500 font-bold bg-red-950/30 py-1">GLOBAL NODES: UNSTABLE</div>
            </div>
          </div>

          {/* Center Column: Lockdown Visual */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-12 lg:py-0 border-x-0 lg:border-x border-red-900/30 bg-red-900/5">

            {/* Warning Tape */}
            <div className="absolute top-4 left-0 w-full h-8 hazard-stripe opacity-20 transform -rotate-2"></div>
            <div className="absolute bottom-4 left-0 w-full h-8 hazard-stripe opacity-20 transform rotate-2"></div>

            <div className="relative group">
              {/* Spinning Lock Rings */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-red-800 animate-spin-slow opacity-50"></div>
              <div className="absolute inset-4 rounded-full border-2 border-red-600 animate-spin opacity-30" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>

              <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-black rounded-full border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.4)]">
                <Lock className="w-24 h-24 text-red-500 animate-pulse" />
              </div>

              {/* Eclipse Shadow */}
              <div className="absolute -top-10 -left-10 w-full h-full bg-black rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
            </div>

            <div className="mt-12 text-center z-10 px-4">
              <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">Access Restricted</h2>
              <p className="text-red-400 font-mono text-sm md:text-base max-w-md mx-auto">
                CRITICAL SYSTEM MAINTENANCE IN PROGRESS. ALL ADMIN PRIVILEGES HAVE BEEN SUSPENDED.
              </p>
              <div className="mt-6 inline-block border border-red-500/30 bg-red-900/10 px-6 py-2 rounded text-xs font-bold tracking-[0.2em] animate-pulse">
                ESTIMATED RETURN: 0400 HRS
              </div>
            </div>
          </div>

          {/* Right Column: Terminal & Hex */}
          <div className="lg:col-span-3 flex flex-col gap-6">

            {/* Terminal Window */}
            <div className="bg-black border-2 border-red-900 flex-1 p-4 font-mono text-xs overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 bg-red-900/20 p-1 text-[10px] text-center font-bold text-red-300">
                ROOT@HABESHA-MAIN:~
              </div>
              <div className="mt-6 flex flex-col justify-end h-full opacity-80">
                {terminalLines.map((line, i) => (
                  <div key={i} className="mb-1 text-red-500 whitespace-nowrap">
                    <span className="text-red-700 mr-2">{'>'}</span>{line}
                  </div>
                ))}
                <div className="animate-pulse">_</div>
              </div>
            </div>

            {/* Hex Dump */}
            <div className="h-48 bg-black/50 border border-red-900/30 p-2 font-mono text-[10px] text-red-800 overflow-hidden leading-tight">
              {hexStream.map((line, i) => (
                <div key={i} className="opacity-50">{line}</div>
              ))}
            </div>

          </div>
        </main>

        {/* Footer: Powered by Tech 5 Ethiopia */}
        <footer className="mt-8 flex flex-col items-center justify-center border-t border-red-900/30 pt-8 opacity-70 hover:opacity-100 transition-opacity w-full">
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-500/60 mb-4">Powered By</span>
          <div className="flex items-center gap-4 text-red-600">
            {/* New Logo Image - Increased size */}
            <img
              src="https://z-cdn-media.chatglm.cn/files/51571057-558e-44fe-a0a5-d9d5077e1c23.png?auth_key=1865625128-62826a3d984944dcbe1e0f6b825c175e-0-c3820b12ac381571e517f52bad06691d"
              alt="t'ch Ethiopia Logo"
              className="w-20 h-30"
            />

          </div>
          <div className="mt-4 text-[13px] text-white">
            Developer by Tech 5 Ethiopia © 2025
          </div>
        </footer>

      </div>
    </div>
  );
};

export default AdminPanelShutdown;