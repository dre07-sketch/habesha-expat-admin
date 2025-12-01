

import React, { useState } from 'react';
import { Send, Mail, Calendar, Zap, Search, Filter, MoreHorizontal, ArrowUpRight, Users, BarChart2, CheckCircle, Clock, MousePointer, Eye, User } from 'lucide-react';
import Modal from '../../components/Modal';
import NewsletterForm from '../../components/forms/NewsletterForm';
import { MOCK_SUBSCRIBERS, MOCK_NEWSLETTERS } from '../../constants';
import { Subscriber, Newsletter } from '../../types';

const Subscribers: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);
  const [newsletters, setNewsletters] = useState<Newsletter[]>(MOCK_NEWSLETTERS);
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers');
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  
  const [subSearch, setSubSearch] = useState('');
  const [newsSearch, setNewsSearch] = useState('');

  const filteredSubscribers = subscribers.filter(sub => 
    (sub.name?.toLowerCase().includes(subSearch.toLowerCase()) || '') ||
    sub.email.toLowerCase().includes(subSearch.toLowerCase())
  );

  const filteredNewsletters = newsletters.filter(news => 
    news.subject.toLowerCase().includes(newsSearch.toLowerCase()) ||
    news.status.toLowerCase().includes(newsSearch.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Audience & Campaigns</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your subscriber base and email newsletters.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200"
            >
            <Send size={20} className="mr-2" /> Create Campaign
            </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl mb-6 w-fit border border-slate-200 dark:border-slate-700/60">
            <button 
                onClick={() => setActiveTab('subscribers')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'subscribers' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                <Users size={16} className="mr-2" /> Subscribers
            </button>
            <button 
                onClick={() => setActiveTab('campaigns')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'campaigns' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                <Mail size={16} className="mr-2" /> Newsletters
            </button>
      </div>

      {activeTab === 'subscribers' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search subscribers by email or name..." 
                        value={subSearch}
                        onChange={(e) => setSubSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors shadow-sm">
                    <Filter size={18} className="mr-2" /> Filter Segment
                </button>
            </div>

            {/* List View */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subscriber</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800/0">
                            {filteredSubscribers.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <img className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" src={sub.avatar || `https://ui-avatars.com/api/?name=${sub.email}&background=random`} alt="" />
                                                <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-800 ${sub.status === 'active' ? 'bg-emerald-500' : sub.status === 'bounced' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{sub.name || 'Unknown User'}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{sub.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                                            sub.plan === 'Premium' 
                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                        }`}>
                                            {sub.plan === 'Premium' && <Zap size={10} className="mr-1 fill-current" />}
                                            {sub.plan || 'Free'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        {sub.source || 'Website'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                            <Calendar size={14} className="mr-1.5 text-slate-400" />
                                            {sub.joinedDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                            sub.status === 'active' 
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                                            : sub.status === 'bounced' 
                                            ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                sub.status === 'active' ? 'bg-emerald-500' : sub.status === 'bounced' ? 'bg-red-500' : 'bg-slate-500'
                                            }`}></span>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Visual */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Showing {filteredSubscribers.length} results</span>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">Prev</button>
                        <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             {/* Newsletter Search */}
             <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search newsletters..." 
                        value={newsSearch}
                        onChange={(e) => setNewsSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                    />
                </div>
             </div>

             <div className="space-y-4">
                {filteredNewsletters.map((news) => (
                    <div 
                        key={news.id} 
                        onClick={() => setSelectedNewsletter(news)}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row gap-6 items-start md:items-center"
                    >
                        {/* Icon Status Box */}
                        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${
                            news.status === 'Sent' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            news.status === 'Scheduled' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                            {news.status === 'Sent' ? <CheckCircle size={24} /> : news.status === 'Scheduled' ? <Clock size={24} /> : <Mail size={24} />}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{news.subject}</h3>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide w-fit mt-2 md:mt-0 ${
                                    news.status === 'Sent' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                    news.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                    {news.status}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-4">
                                <span className="flex items-center"><Calendar size={14} className="mr-1.5"/> {news.sentDate}</span>
                                <span className="flex items-center"><Users size={14} className="mr-1.5"/> {news.segment}</span>
                            </div>
                        </div>

                        {/* Quick Stats (Only for Sent) */}
                        {news.status === 'Sent' && (
                            <div className="flex space-x-6 border-l border-slate-100 dark:border-slate-700 pl-6 py-1">
                                <div>
                                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{news.openRate}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center"><Eye size={10} className="mr-1"/> Open Rate</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{news.clickRate}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center"><MousePointer size={10} className="mr-1"/> Clicks</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                 {filteredNewsletters.length === 0 && (
                     <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        No newsletters found.
                    </div>
                 )}
             </div>
          </div>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create Email Campaign" maxWidth="max-w-3xl">
        <NewsletterForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Campaign Details Modal */}
      <Modal isOpen={!!selectedNewsletter} onClose={() => setSelectedNewsletter(null)} title="Campaign Report" maxWidth="max-w-5xl">
        {selectedNewsletter && (
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col lg:flex-row">
                
                {/* Left: Email Preview */}
                <div className="w-full lg:w-3/5 bg-slate-100 dark:bg-black border-r border-slate-200 dark:border-slate-800 p-6 lg:p-8 overflow-y-auto max-h-[80vh]">
                    <div className="bg-white rounded-lg shadow-2xl max-w-xl mx-auto overflow-hidden">
                        {/* Fake Email Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-4">
                            <h3 className="font-bold text-lg text-slate-800 mb-1">{selectedNewsletter.subject}</h3>
                            <div className="flex items-center text-xs text-slate-500">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">H</div>
                                <span className="font-bold text-slate-700 mr-1">Habesha Expat</span> 
                                <span>&lt;admin@habeshaexpat.com&gt;</span>
                            </div>
                        </div>
                        {/* Preview Image */}
                         {selectedNewsletter.image && (
                            <img src={selectedNewsletter.image} alt="Banner" className="w-full h-auto" />
                        )}
                        {/* Content Body */}
                        <div className="p-6 text-slate-700 leading-relaxed whitespace-pre-line text-sm font-serif">
                            {selectedNewsletter.content || "No content preview available for this draft."}
                        </div>
                         <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                            You received this email because you subscribed to our newsletter. <br/> 
                            <a href="#" className="underline">Unsubscribe</a>
                        </div>
                    </div>
                </div>

                {/* Right: Analytics Dashboard */}
                <div className="w-full lg:w-2/5 p-6 lg:p-8 bg-white dark:bg-slate-900 overflow-y-auto max-h-[80vh]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 block">Status</span>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold uppercase ${
                                selectedNewsletter.status === 'Sent' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                                selectedNewsletter.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                                {selectedNewsletter.status}
                            </div>
                        </div>
                         <div>
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 block">Sent On</span>
                            <div className="text-slate-800 dark:text-white font-bold text-sm">{selectedNewsletter.sentDate}</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-slate-800/50 p-5 rounded-xl border border-blue-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Recipients</span>
                                <Users size={16} className="text-blue-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{selectedNewsletter.recipientCount.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Segment: <span className="font-bold text-blue-600 dark:text-blue-400">{selectedNewsletter.segment}</span></div>
                        </div>

                        {selectedNewsletter.status === 'Sent' ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 dark:bg-slate-800/50 p-5 rounded-xl border border-emerald-100 dark:border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Open Rate</span>
                                            <Eye size={16} className="text-emerald-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{selectedNewsletter.openRate}</div>
                                    </div>
                                    <div className="bg-indigo-50 dark:bg-slate-800/50 p-5 rounded-xl border border-indigo-100 dark:border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Click Rate</span>
                                            <MousePointer size={16} className="text-indigo-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{selectedNewsletter.clickRate}</div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance Over Time</h4>
                                    <div className="h-32 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-end justify-between p-2 px-4">
                                         {/* Fake Bar Chart */}
                                         {[40, 65, 85, 55, 45, 30, 20].map((h, i) => (
                                             <div key={i} className="w-8 bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                                         ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium px-2">
                                        <span>0h</span>
                                        <span>24h</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                Analytics will appear here once the campaign is sent.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Subscribers;