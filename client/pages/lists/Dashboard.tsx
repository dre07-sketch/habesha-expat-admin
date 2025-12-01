
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { 
  Users, FileText, Mic, Video, Calendar, Megaphone, 
  Globe, MessageSquare, Mail, MapPin, Star,
  Utensils, Briefcase, Home, Monitor, HeartPulse, 
  TrendingUp, Building2, ArrowUpRight, Activity, ArrowRight,
  TrendingDown
} from 'lucide-react';

// --- DATA CONSTANTS ---

const MEMBERSHIP_DATA = [
  { name: 'Free Members', value: 10230, color: '#3b82f6' },
  { name: 'Premium Members', value: 2220, color: '#1e293b' },
];

const GROWTH_DATA = [
  { name: 'Jan', users: 4000, articles: 2400, businesses: 1400 },
  { name: 'Feb', users: 4500, articles: 2800, businesses: 1600 },
  { name: 'Mar', users: 5200, articles: 3200, businesses: 1900 },
  { name: 'Apr', users: 6800, articles: 3800, businesses: 2100 },
  { name: 'May', users: 8900, articles: 4500, businesses: 2400 },
  { name: 'Jun', users: 10500, articles: 5200, businesses: 2800 },
  { name: 'Jul', users: 12450, articles: 6100, businesses: 3200 },
];

const LOCATION_DATA = [
  { name: 'USA', value: 4500, flag: '🇺🇸', growth: '+12%' },
  { name: 'Ethiopia', value: 3800, flag: '🇪🇹', growth: '+24%' },
  { name: 'UK', value: 1200, flag: '🇬🇧', growth: '+5%' },
  { name: 'Canada', value: 950, flag: '🇨🇦', growth: '+8%' },
  { name: 'Germany', value: 600, flag: '🇩🇪', growth: '+3%' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- TOP SUMMARY STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { 
              label: 'Total Users', 
              value: '12,450', 
              badge: '+12%', 
              icon: Users, 
              iconClass: 'bg-blue-600 text-white shadow-blue-600/20',
              badgeClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
              barClass: 'bg-blue-500',
              progress: 65 
            },
            { 
              label: 'B2B Requests', 
              value: '567', 
              badge: '+18%', 
              icon: Building2, 
              iconClass: 'bg-indigo-600 text-white shadow-indigo-600/20',
              badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
              barClass: 'bg-indigo-500',
              progress: 45 
            },
            { 
              label: 'Jobs Posted', 
              value: '24', 
              badge: '+5', 
              icon: Briefcase, 
              iconClass: 'bg-emerald-600 text-white shadow-emerald-600/20',
              badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
              barClass: 'bg-emerald-500',
              progress: 20 
            },
            { 
              label: 'Total Podcasts', 
              value: '45', 
              badge: '+8%', 
              icon: Mic, 
              iconClass: 'bg-rose-600 text-white shadow-rose-600/20',
              badgeClass: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
              barClass: 'bg-rose-500',
              progress: 60 
            },
            { 
              label: 'Total Videos', 
              value: '127', 
              badge: '+15%', 
              icon: Video, 
              iconClass: 'bg-sky-600 text-white shadow-sky-600/20',
              badgeClass: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
              barClass: 'bg-sky-500',
              progress: 45 
            },
            { 
              label: 'Articles', 
              value: '342', 
              badge: '+24%', 
              icon: FileText, 
              iconClass: 'bg-purple-600 text-white shadow-purple-600/20',
              badgeClass: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
              barClass: 'bg-purple-500',
              progress: 78 
            },
            { 
              label: 'Events', 
              value: '8', 
              badge: '+2', 
              icon: Calendar, 
              iconClass: 'bg-amber-500 text-white shadow-amber-500/20',
              badgeClass: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
              barClass: 'bg-amber-500',
              progress: 80 
            },
        ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl shadow-lg ${stat.iconClass}`}>
                        <stat.icon size={24} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.badgeClass}`}>
                        {stat.badge}
                    </span>
                </div>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                </div>
                <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${stat.barClass}`} style={{ width: `${stat.progress}%` }}></div>
                </div>
            </div>
        ))}
      </div>

      {/* --- MONTHLY GROWTH TRENDS CHART --- */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="text-blue-600 mr-3" size={28} />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Monthly Growth Trends</h2>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-blue-600 dark:text-blue-400">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> Users
            </div>
            <div className="flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div> Articles
            </div>
            <div className="flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 rounded-full bg-slate-500 mr-2"></div> Businesses
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
              <Area type="monotone" dataKey="articles" stroke="#6366f1" fillOpacity={1} fill="url(#colorArticles)" strokeWidth={3} />
              <Area type="monotone" dataKey="businesses" stroke="#64748b" fillOpacity={0.1} fill="#64748b" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- CONTENT ENGAGEMENT & BUSINESS ANALYTICS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* LEFT: Content Engagement */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <Globe className="mr-2 text-blue-500" size={20} /> Content Engagement
                  </h2>
                  <button className="text-slate-400 hover:text-blue-500 transition-colors"><ArrowRight size={18}/></button>
              </div>

              <div className="space-y-6 mb-10">
                  {/* Progress Items */}
                  {[
                      { label: 'Articles', icon: FileText, views: '45,230 views', pct: 78, color: 'bg-blue-600' },
                      { label: 'Videos', icon: Video, views: '32,150 views', pct: 85, color: 'bg-indigo-500' },
                      { label: 'Podcasts', icon: Mic, views: '18,640 views', pct: 72, color: 'bg-slate-500' },
                      { label: 'Events', icon: Calendar, views: '12,890 views', pct: 91, color: 'bg-blue-400' },
                      { label: 'Directory', icon: MapPin, views: '28,340 views', pct: 68, color: 'bg-slate-600' },
                  ].map((item, i) => (
                      <div key={i}>
                          <div className="flex justify-between items-center mb-2 text-sm">
                              <div className="flex items-center font-medium text-slate-700 dark:text-slate-200">
                                  <item.icon size={16} className="mr-3 text-slate-400" /> {item.label}
                              </div>
                              <div className="flex items-center">
                                  <span className="text-slate-500 dark:text-slate-400 mr-3 text-xs">{item.views}</span>
                                  <span className="font-bold text-blue-600 dark:text-blue-400">{item.pct}%</span>
                              </div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Bottom Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="p-2 w-fit rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
                          <FileText size={18} />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Articles</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">342</div>
                      <div className="text-xs font-bold text-blue-500 mt-1">+24</div>
                  </div>
                   <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="p-2 w-fit rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-3">
                          <MessageSquare size={18} />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Comments</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">1,856</div>
                      <div className="text-xs font-bold text-indigo-500 mt-1">+142</div>
                  </div>
                   <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="p-2 w-fit rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-3">
                          <Mail size={18} />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Subscribers</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">8,745</div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">+324</div>
                  </div>
              </div>
          </div>

          {/* RIGHT: Business Directory Analytics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <MapPin className="mr-2 text-slate-500" size={20} /> Business Directory Analytics
                  </h2>
              </div>

              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                         <div className="p-2 w-fit rounded-lg bg-blue-500/20 text-blue-400 mb-3">
                              <MapPin size={18} />
                          </div>
                          <div className="text-xs text-slate-400 font-medium">Total Businesses</div>
                          <div className="text-2xl font-bold mt-1">567</div>
                          <div className="text-xs font-bold text-blue-400 mt-1">+32</div>
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                         <div className="p-2 w-fit rounded-lg bg-indigo-500/20 text-indigo-400 mb-3">
                              <Star size={18} />
                          </div>
                          <div className="text-xs text-slate-400 font-medium">Reviews</div>
                          <div className="text-2xl font-bold mt-1">1,234</div>
                          <div className="text-xs font-bold text-indigo-400 mt-1">+87</div>
                      </div>
                       <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                         <div className="p-2 w-fit rounded-lg bg-slate-600/20 text-slate-300 mb-3">
                              <FileText size={18} />
                          </div>
                          <div className="text-xs text-slate-400 font-medium">New Listings</div>
                          <div className="text-2xl font-bold mt-1">42</div>
                          <div className="text-xs font-bold text-slate-300 mt-1">+12</div>
                      </div>
                       <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Popular Categories</h3>
              <div className="space-y-5">
                   {[
                      { label: 'Restaurants', icon: Utensils, count: '124', growth: '+12%', pct: 60, sub: '21.9%' },
                      { label: 'Professional Services', icon: Briefcase, count: '98', growth: '+8%', pct: 45, sub: '17.3%' },
                      { label: 'Real Estate', icon: Home, count: '76', growth: '+15%', pct: 35, sub: '13.4%' },
                      { label: 'Technology', icon: Monitor, count: '65', growth: '+22%', pct: 28, sub: '11.5%' },
                      { label: 'Healthcare', icon: HeartPulse, count: '54', growth: '+5%', pct: 22, sub: '9.5%' },
                   ].map((cat, i) => (
                       <div key={i}>
                           <div className="flex justify-between items-end mb-2">
                               <div className="flex items-center">
                                   <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mr-3">
                                       <cat.icon size={14} />
                                   </div>
                                   <div>
                                       <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{cat.label}</div>
                                   </div>
                               </div>
                               <div className="text-right flex items-center gap-3">
                                   <span className="font-bold text-slate-800 dark:text-white">{cat.count}</span>
                                   <span className="text-xs font-bold text-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">{cat.growth}</span>
                               </div>
                           </div>
                           <div className="relative pt-1">
                               <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                   <div className="h-full bg-slate-800 dark:bg-blue-500 rounded-full" style={{ width: `${cat.pct}%` }}></div>
                               </div>
                               <div className="text-[10px] text-slate-400 text-right mt-1">{cat.sub}</div>
                           </div>
                       </div>
                   ))}
              </div>
          </div>
      </div>

      {/* GLOBAL USER MAP - ALWAYS DARK MODE */}
      <div className="bg-[#0f172a] text-white p-8 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden flex flex-col min-h-[500px]">
          {/* Map Background - Inverted for White Lines on Dark Background */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center bg-no-repeat pointer-events-none invert"></div>
          
          {/* Animated Map Markers (Simulated) */}
          <div className="absolute inset-0 pointer-events-none">
             {/* North America */}
             <span className="absolute top-[30%] left-[20%] w-3 h-3 bg-blue-500 rounded-full animate-ping"></span>
             <span className="absolute top-[30%] left-[20%] w-3 h-3 bg-blue-500 rounded-full"></span>
             
             <span className="absolute top-[35%] left-[15%] w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-700"></span>
             <span className="absolute top-[35%] left-[15%] w-2 h-2 bg-indigo-500 rounded-full"></span>

             {/* Europe */}
             <span className="absolute top-[25%] left-[48%] w-3 h-3 bg-emerald-500 rounded-full animate-ping delay-300"></span>
             <span className="absolute top-[25%] left-[48%] w-3 h-3 bg-emerald-500 rounded-full"></span>
             
             {/* Africa (Ethiopia approx) */}
             <span className="absolute top-[45%] left-[53%] w-4 h-4 bg-amber-500 rounded-full animate-ping delay-500"></span>
             <span className="absolute top-[45%] left-[53%] w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>

             {/* Asia */}
             <span className="absolute top-[30%] left-[70%] w-2 h-2 bg-purple-500 rounded-full animate-ping delay-1000"></span>
             <span className="absolute top-[30%] left-[70%] w-2 h-2 bg-purple-500 rounded-full"></span>
          </div>

          <div className="relative z-10 flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center"><Globe className="mr-3 text-blue-400"/> Global Community</h2>
                <p className="text-slate-300 text-sm mt-1 shadow-black drop-shadow-md">Real-time user activity map.</p>
              </div>
              <div className="flex gap-2 bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                   <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                   <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live</span>
              </div>
          </div>

          {/* OVERLAY STATS: Top Active Regions - Cool Glassmorphic Style */}
          <div className="absolute right-8 top-28 z-20 w-72 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-right-4 duration-700">
             <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Active Regions</h3>
                 <Globe size={14} className="text-blue-400 opacity-70" />
             </div>
             
             <div className="space-y-4">
                 {LOCATION_DATA.map((loc, i) => (
                     <div key={i} className="group">
                         <div className="flex justify-between items-center text-sm mb-1">
                             <div className="flex items-center text-slate-200 font-medium">
                                 <span className="mr-2 text-base">{loc.flag}</span> {loc.name}
                             </div>
                             <div className="flex items-center gap-2">
                                 <span className="font-bold text-white">{loc.value.toLocaleString()}</span>
                                 <span className="text-[10px] text-emerald-400 bg-emerald-900/30 px-1 rounded">{loc.growth}</span>
                             </div>
                         </div>
                         <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-500' : 'bg-slate-500'}`} 
                                style={{ width: `${(loc.value / 5000) * 100}%` }}
                             ></div>
                         </div>
                     </div>
                 ))}
             </div>
             
             <div className="mt-5 pt-3 border-t border-white/5 text-center">
                 <button className="text-xs text-blue-400 hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center justify-center w-full">
                     View Full Report <ArrowRight size={12} className="ml-1" />
                 </button>
             </div>
          </div>
      </div>

      {/* MEMBERSHIP DISTRIBUTION - Moved & Redesigned */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-6">
            <Users className="mr-2 text-blue-500" size={20} /> Membership Distribution
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
             {/* Chart Section */}
             <div className="h-64 relative md:col-span-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={MEMBERSHIP_DATA}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {MEMBERSHIP_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">12,450</span>
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total</span>
                </div>
             </div>

             {/* Stats Cards Section */}
             <div className="md:col-span-2 grid grid-cols-1 gap-4">
                 {/* Free Members Card */}
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                     <div className="flex items-center">
                         <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white mr-4 shadow-lg shadow-blue-500/20">
                             <Users size={24} />
                         </div>
                         <div>
                             <div className="flex items-center gap-3 mb-1">
                                 <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">Free Members</span>
                                 <span className="text-xs font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">+8%</span>
                             </div>
                             <div className="text-3xl font-bold text-slate-800 dark:text-white">10,230</div>
                             <div className="text-xs font-medium text-slate-400 mt-1">82.2% of total</div>
                         </div>
                     </div>
                 </div>

                 {/* Premium Members Card */}
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                     <div className="flex items-center">
                         <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-white mr-4 shadow-lg shadow-slate-700/20">
                             <Star size={24} />
                         </div>
                         <div>
                             <div className="flex items-center gap-3 mb-1">
                                 <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">Premium Members</span>
                             </div>
                             <div className="text-3xl font-bold text-slate-800 dark:text-white">2,220</div>
                             <div className="text-xs font-medium text-slate-400 mt-1">17.8% of total</div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      </div>

    </div>
  );
};

export default Dashboard;
