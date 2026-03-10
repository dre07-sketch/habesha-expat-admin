import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Mic, Video, Users,
  FileText, Mail, Calendar, Megaphone, Tag, Settings, LogOut,
  Sun, Moon, Briefcase, PlaneLanding, PenTool, Coffee
} from 'lucide-react';


const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('habesha_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('habesha_theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          // Demo Fallback
          setUser({ name: "Demo Admin", role: "Super Admin", avatar_url: "" });
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/login/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'B2B Requests', path: '/b2b' },
    { icon: FileText, label: 'Articles', path: '/articles' },
    { icon: PlaneLanding, label: 'Travel', path: '/travel' },
    { icon: Mic, label: 'Podcasts', path: '/podcasts' },
    { icon: Video, label: 'Videos', path: '/videos' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: PenTool, label: 'Authors', path: '/authors' },
    { icon: Coffee, label: 'Lounge Members', path: '/lounge' },
    { icon: Mail, label: 'Newsletters', path: '/subscribers' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Megaphone, label: 'Ad Banners', path: '/ads' },
    { icon: Tag, label: 'Categories', path: '/categories' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 overflow-hidden">

      {/* Sidebar 
          z-30 is correct. It will sit below the Form's z-50.
      */}
      <aside className={`w-72 flex flex-col fixed h-full border-r z-30 transition-all duration-300 backdrop-blur-2xl shadow-[0px_0px_50px_rgba(0,0,0,0.1)]
        ${darkMode
          ? 'bg-[#0f172a]/95 border-slate-800/50 text-slate-300'
          : 'bg-white/80 border-slate-200/60 text-slate-600'
        }`}
      >
        <div className={`p-6 flex items-center border-b transition-colors h-20 shrink-0
          ${darkMode ? 'border-slate-800 bg-[#020617]/40' : 'border-slate-200/50 bg-white/40'}`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-xl mr-3.5 flex items-center justify-center text-white font-black shadow-xl shadow-blue-500/30 text-lg transform hover:rotate-6 transition-transform">H</div>
          <div className="flex flex-col">
            <h1 className={`font-black text-lg tracking-tight leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>Habesha Expat</h1>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-500 mt-1">Admin Matrix</span>
          </div>
        </div>

        <nav className={`flex-1 overflow-y-auto py-6 custom-scrollbar transition-colors ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>
          <ul className="space-y-1.5 px-4 text">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                      ? darkMode
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white shadow-xl shadow-blue-900/10 border border-blue-500/20 translate-x-1.5'
                        : 'bg-white text-blue-600 shadow-xl shadow-slate-200/60 border border-slate-100 translate-x-1.5'
                      : darkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1.5'
                        : 'text-slate-500 hover:bg-white/80 hover:text-slate-900 hover:translate-x-1.5'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-full" />
                    )}
                    <Icon size={20} className={`mr-4 transition-all duration-300 ${isActive ? (darkMode ? 'text-blue-400 scale-110' : 'text-blue-600 scale-110') : (darkMode ? 'group-hover:text-blue-400 group-hover:scale-110' : 'group-hover:text-blue-500 group-hover:scale-110')}`} />
                    <span className={`font-bold transition-all duration-300 ${isActive ? 'text-base' : 'text-sm'}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-4 border-t transition-colors mt-auto ${darkMode ? 'border-slate-800 bg-[#020617]/40' : 'border-slate-200/50 bg-white/40'}`}>
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-4 py-3.5 rounded-2xl transition-all duration-300 bg-red-500/5 hover:bg-red-500 dark:hover:bg-red-500 group text-red-500 hover:text-white border border-red-500/10"
          >
            <LogOut size={20} className="mr-4 group-hover:rotate-12 transition-transform" />
            <span className="font-black text-sm uppercase tracking-widest">Logout System</span>
          </button>
        </div>
      </aside>

      {/* Main Content 
          Removed 'z-0'. Keeping main relative but allowing children (like the Modal) 
          to break out of the stacking context if they are fixed.
      */}
      <main className="flex-1 ml-72 overflow-auto bg-slate-50 dark:bg-[#020617] relative h-full flex flex-col">
        {/* Background Decoration */}
        {!darkMode && <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10 pointer-events-none fixed"></div>}

        <header className={`sticky top-0 z-20 px-8 py-5 flex justify-between items-center border-b transition-all duration-300 backdrop-blur-md shrink-0 ${darkMode ? 'bg-[#0f172a]/80 border-slate-800' : 'bg-white/70 border-slate-200/60'}`}>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{menuItems.find(i => i.path === location.pathname)?.label || 'Intelligence Hub'}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">System Operational</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-3 rounded-2xl transition-all duration-300 ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-md border border-slate-100 hover:bg-slate-50'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{user?.name || 'Administrator'}</p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-none">{user?.role || 'Nexus Prime'}</p>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 p-0.5 transition-all duration-300 hover:scale-105 ${darkMode ? 'border-slate-800 bg-slate-800 shadow-xl shadow-black/20' : 'border-white bg-white shadow-xl shadow-blue-500/10'}`}>
                <img
                  src={user?.avatar_url || 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'}
                  alt="User"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </header>

        {/* 
           Content Wrapper 
           Removed 'animate-in' class. CSS transforms (used in animations) create a new 
           stacking context which can trap 'fixed' children (like your TravelForm modal) 
           inside this div, preventing them from covering the Sidebar. 
        */}
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;