

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Mic, Video, Users, 
  FileText, Mail, Calendar, Megaphone, Tag, Settings, LogOut,
  Sun, Moon, Briefcase
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Persist theme preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('habesha_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('habesha_theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'B2B Requests', path: '/b2b' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Mic, label: 'Podcasts', path: '/podcasts' },
    { icon: Video, label: 'Videos', path: '/videos' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: FileText, label: 'Articles', path: '/articles' },
    { icon: Mail, label: 'Subscribers', path: '/subscribers' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Megaphone, label: 'Ad Banners', path: '/ads' },
    { icon: Tag, label: 'Categories', path: '/categories' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Sidebar - Glassmorphic Light Mode / Solid Dark Mode */}
      <aside className={`w-64 flex flex-col fixed h-full border-r z-30 transition-all duration-300 backdrop-blur-xl shadow-2xl
        ${darkMode 
          ? 'bg-[#0f172a] border-slate-800 text-slate-300' 
          : 'bg-white/70 border-slate-200/60 text-slate-600 supports-[backdrop-filter]:bg-white/60'
        }`}
      >
        {/* Logo Section */}
        <div className={`p-6 flex items-center border-b transition-colors h-20 shrink-0
          ${darkMode ? 'border-slate-800 bg-[#020617]' : 'border-slate-200/50 bg-white/40'}`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg mr-3 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">H</div>
          <h1 className={`font-bold text-lg tracking-wide ${darkMode ? 'text-white' : 'text-slate-800'}`}>Habesha Expat</h1>
        </div>
        
        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-4 custom-scrollbar transition-colors ${darkMode ? 'bg-[#0f172a]' : 'bg-transparent'}`}>
          <ul className="space-y-1.5 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive 
                        ? darkMode 
                          ? 'bg-blue-900/50 text-white shadow-lg shadow-blue-900/20 border border-blue-800/50 translate-x-1' 
                          : 'bg-white text-blue-600 shadow-md shadow-slate-200/50 border border-slate-100 translate-x-1'
                        : darkMode
                          ? 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                          : 'text-slate-500 hover:bg-white/60 hover:text-slate-900 hover:translate-x-1'
                    }`}
                  >
                    {isActive && !darkMode && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                    )}
                    <Icon size={20} className={`mr-3 transition-colors ${
                      isActive 
                        ? darkMode ? 'text-blue-400' : 'text-blue-600'
                        : darkMode ? 'group-hover:text-blue-400' : 'group-hover:text-blue-500'
                    }`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className={`p-4 border-t transition-colors mt-auto ${darkMode ? 'border-slate-800 bg-[#020617]' : 'border-slate-200/50 bg-white/40'}`}>
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2.5 rounded-xl transition-colors ${
              darkMode 
                ? 'text-slate-400 hover:bg-red-900/20 hover:text-red-400' 
                : 'text-slate-500 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto bg-slate-50 dark:bg-[#020617] relative z-0 h-full flex flex-col">
         {/* Background Decoration for Light Mode Glassmorphism to pop */}
         {!darkMode && (
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10 pointer-events-none fixed"></div>
         )}

        <header className={`sticky top-0 z-20 px-8 py-4 flex justify-between items-center border-b transition-all duration-300 backdrop-blur-md shrink-0
            ${darkMode 
                ? 'bg-[#0f172a]/80 border-slate-800' 
                : 'bg-white/70 border-slate-200/60'
            }`}
        >
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
          </h2>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full transition-colors ${
                  darkMode 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-100'
              }`}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
              </div>
              <div className={`w-10 h-10 rounded-full border-2 overflow-hidden shadow-sm ${darkMode ? 'bg-slate-700 border-blue-900' : 'bg-slate-100 border-blue-100'}`}>
                  <img src="https://picsum.photos/100/100" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>
        <div className="p-8 animate-in fade-in duration-500 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;