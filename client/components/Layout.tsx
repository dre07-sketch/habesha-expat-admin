import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Mic, Video, Users, 
  FileText, Mail, Calendar, Megaphone, Tag, Settings, LogOut,
  Sun, Moon, Briefcase, PlaneLanding
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
           setUser({ name: "Demo Admin", role: "Super Admin", avatar_url: ""});
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
    { icon: Mail, label: 'Subscribers', path: '/subscribers' },
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
      <aside className={`w-64 flex flex-col fixed h-full border-r z-30 transition-all duration-300 backdrop-blur-xl shadow-2xl
        ${darkMode 
          ? 'bg-[#0f172a] border-slate-800 text-slate-300' 
          : 'bg-white/70 border-slate-200/60 text-slate-600'
        }`}
      >
        <div className={`p-6 flex items-center border-b transition-colors h-20 shrink-0
          ${darkMode ? 'border-slate-800 bg-[#020617]' : 'border-slate-200/50 bg-white/40'}`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg mr-3 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">H</div>
          <h1 className={`font-bold text-lg tracking-wide ${darkMode ? 'text-white' : 'text-slate-800'}`}>Habesha Expat</h1>
        </div>
        
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
                    <Icon size={20} className={`mr-3 transition-colors ${isActive ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'group-hover:text-blue-400' : 'group-hover:text-blue-500')}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-4 border-t transition-colors mt-auto ${darkMode ? 'border-slate-800 bg-[#020617]' : 'border-slate-200/50 bg-white/40'}`}>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content 
          Removed 'z-0'. Keeping main relative but allowing children (like the Modal) 
          to break out of the stacking context if they are fixed.
      */}
      <main className="flex-1 ml-64 overflow-auto bg-slate-50 dark:bg-[#020617] relative h-full flex flex-col">
         {/* Background Decoration */}
         {!darkMode && <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10 pointer-events-none fixed"></div>}

        <header className={`sticky top-0 z-20 px-8 py-4 flex justify-between items-center border-b transition-all duration-300 backdrop-blur-md shrink-0 ${darkMode ? 'bg-[#0f172a]/80 border-slate-800' : 'bg-white/70 border-slate-200/60'}`}>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{menuItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}</h2>
          
          <div className="flex items-center space-x-6">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-full transition-colors ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm border border-slate-100'}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
               <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user?.role || 'Admin'}</p>
               </div>
               <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'border-slate-700' : 'border-white shadow-sm'}`}>
                 <img 
                    src={user?.avatar_url || 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'} 
                    alt="User" 
                    className="w-full h-full object-cover"
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