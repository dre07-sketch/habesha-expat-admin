

import React, { useState } from 'react';
import { Plus, Play, Clock, Mic, Calendar, Headphones, BarChart3, ExternalLink, MoreHorizontal, Heart, MessageCircle, Eye, EyeOff, User as UserIcon, ThumbsUp, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import PodcastForm from '../../components/forms/PodcastForm';
import { MOCK_PODCASTS } from '../../constants';
import { Podcast } from '../../types';

const Podcasts: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'likes' | 'comments'>('details');
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleVisibility = () => {
    if (selectedPodcast) {
      setSelectedPodcast({
        ...selectedPodcast,
        status: selectedPodcast.status === 'visible' ? 'hidden' : 'visible'
      });
    }
  };

  const filteredPodcasts = MOCK_PODCASTS.filter(pod => 
    pod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pod.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pod.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Podcast Episodes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your audio content library and RSS feed.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search podcasts..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
            </div>
            <button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
            <Plus size={20} className="mr-2" /> New Episode
            </button>
        </div>
      </div>

      {/* Modern List View */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="w-1/2 pl-4">Episode Details</div>
            <div className="w-1/6">Category</div>
            <div className="w-1/6">Duration</div>
            <div className="w-1/12 text-right pr-4">Action</div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredPodcasts.map((pod) => (
                <div 
                    key={pod.id} 
                    onClick={() => { setSelectedPodcast(pod); setActiveTab('details'); }}
                    className="group flex items-center p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer"
                >
                    {/* Episode Info */}
                    <div className="w-1/2 flex items-center gap-4">
                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                            <img src={pod.coverImage} alt={pod.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 text-blue-900 rounded-full p-1.5 shadow-sm scale-90 group-hover:scale-100 transition-transform">
                                    <Play size={14} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{pod.title}</h3>
                                {pod.status === 'hidden' && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] rounded uppercase font-bold tracking-wider">Hidden</span>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <Mic size={12} className="mr-1" /> <span className="font-medium">{pod.host}</span>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="w-1/6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {pod.category}
                        </span>
                    </div>

                    {/* Duration */}
                    <div className="w-1/6 text-sm font-mono text-slate-500 dark:text-slate-400 flex items-center">
                        <Clock size={14} className="mr-2 text-slate-400" />
                        {pod.duration}
                    </div>

                    {/* Actions */}
                    <div className="w-1/12 flex justify-end pr-2">
                         <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <MoreHorizontal size={20} />
                         </button>
                    </div>
                </div>
            ))}
            {filteredPodcasts.length === 0 && (
                 <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No episodes found.
                </div>
            )}
        </div>
      </div>

      {/* Add Podcast Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Upload New Episode" maxWidth="max-w-4xl">
        <PodcastForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Podcast Details Modal - "Cool Music Player" Design - Scrollable Layout */}
      <Modal isOpen={!!selectedPodcast} onClose={() => setSelectedPodcast(null)} title="Now Playing" maxWidth="max-w-4xl">
        {selectedPodcast && (
          <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
             {/* Background Blur Effect */}
             <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
                <img src={selectedPodcast.coverImage} alt="" className="w-full h-full object-cover blur-3xl scale-150" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent"></div>
             </div>

             <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8">
                {/* Left: Album Art & Stats */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="w-full aspect-square rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group">
                        <img src={selectedPodcast.coverImage} alt={selectedPodcast.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex w-full justify-between mt-6 px-2">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Duration</div>
                            <div className="text-lg font-mono font-bold text-slate-800 dark:text-white">{selectedPodcast.duration}</div>
                        </div>
                        <div className="text-center border-l border-slate-200 dark:border-slate-700 pl-6">
                             <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Size</div>
                            <div className="text-lg font-mono font-bold text-slate-800 dark:text-white">42 MB</div>
                        </div>
                    </div>

                     {/* Engagement Stats Summary */}
                    <div className="flex w-full justify-between mt-6 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-4 backdrop-blur-md border border-white/10">
                        <div className="flex items-center space-x-2">
                            <Heart className="text-red-500" size={20} fill="currentColor" />
                            <div>
                                <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedPodcast.likes || 0}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Likes</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 border-l border-slate-300 dark:border-slate-700 pl-4">
                            <MessageCircle className="text-blue-500" size={20} fill="currentColor" />
                            <div>
                                <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedPodcast.comments || 0}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Comments</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Player, Info & Social Tabs */}
                <div className="w-full md:w-2/3 flex flex-col">
                    
                    {/* Header Info */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-600/30">{selectedPodcast.category}</span>
                            <span className="flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <Calendar size={12} className="mr-1" /> Added Today
                            </span>
                        </div>
                        <span className={`flex items-center text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${selectedPodcast.status === 'visible' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {selectedPodcast.status === 'visible' ? <Eye size={12} className="mr-1"/> : <EyeOff size={12} className="mr-1"/>}
                            {selectedPodcast.status || 'visible'}
                        </span>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{selectedPodcast.title}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium flex items-center mb-6">
                        <Mic size={18} className="mr-2 text-blue-500" /> 
                        Host: <span className="text-slate-700 dark:text-slate-300 ml-1">{selectedPodcast.host}</span>
                    </p>

                    {/* Player Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-100 dark:border-slate-800 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Preview Audio</span>
                            </div>
                            <Headphones size={16} className="text-slate-400" />
                        </div>
                        <audio controls className="w-full h-10 block accent-blue-600">
                            <source src={selectedPodcast.audioFile} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                        <button 
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 rounded-t-lg ${activeTab === 'details' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('likes')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 rounded-t-lg ${activeTab === 'likes' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                            Likes ({selectedPodcast.likedBy?.length || 0})
                        </button>
                        <button 
                            onClick={() => setActiveTab('comments')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 rounded-t-lg ${activeTab === 'comments' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                            Comments ({selectedPodcast.commentList?.length || 0})
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[200px] bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-4">
                        
                        {/* DETAILS TAB */}
                        {activeTab === 'details' && (
                            <div className="space-y-4">
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                                     <div className="flex justify-between text-xs text-slate-400 mb-1 uppercase font-bold">
                                        <span>Slug</span>
                                        <a href="#" className="text-blue-500 hover:underline flex items-center">View Live <ExternalLink size={10} className="ml-1"/></a>
                                     </div>
                                     <div className="font-mono text-sm text-slate-600 dark:text-slate-300 break-all">
                                        /podcasts/{selectedPodcast.slug}
                                     </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    This episode explores the dynamic landscape of technology in East Africa, featuring interviews with key innovators. It covers recent startup success stories, challenges in infrastructure, and the role of the diaspora in tech acceleration.
                                </p>
                            </div>
                        )}

                        {/* LIKES TAB */}
                        {activeTab === 'likes' && (
                            <div className="space-y-2">
                                {(selectedPodcast.likedBy && selectedPodcast.likedBy.length > 0) ? (
                                    selectedPodcast.likedBy.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-slate-400">
                                                <ThumbsUp size={12} className="mr-1" /> {user.date}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">No likes yet.</div>
                                )}
                            </div>
                        )}

                        {/* COMMENTS TAB */}
                        {activeTab === 'comments' && (
                             <div className="space-y-3">
                                {(selectedPodcast.commentList && selectedPodcast.commentList.length > 0) ? (
                                    selectedPodcast.commentList.map(comment => (
                                        <div key={comment.id} className="flex space-x-3 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                                            <img src={comment.avatar} alt={comment.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{comment.name}</span>
                                                    <span className="text-[10px] text-slate-400">{comment.date}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">No comments yet.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons - Always Visible */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex space-x-3">
                             {selectedPodcast.status === 'visible' ? (
                                <button 
                                    onClick={handleToggleVisibility}
                                    className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center border border-slate-300 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800"
                                >
                                    <EyeOff size={16} className="mr-2" /> Take Down Episode
                                </button>
                            ) : (
                                <button 
                                    onClick={handleToggleVisibility}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center shadow-lg shadow-emerald-600/20"
                                >
                                    <Eye size={16} className="mr-2" /> Make Episode Visible
                                </button>
                            )}
                        </div>
                    </div>

                </div>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Podcasts;