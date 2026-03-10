

import React, { useState, useEffect } from 'react';
import { Plus, Play, Clock, Mic, Calendar, Headphones, BarChart3, ExternalLink, MoreHorizontal, Heart, MessageCircle, Eye, EyeOff, User as UserIcon, ThumbsUp, Search, Loader2, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import PodcastForm from '../../components/forms/PodcastForm';
import { Podcast } from '../../types';

const Podcasts: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'likes' | 'comments'>('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/podcasts/podcasts-get', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setPodcasts(result.data);
      }
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleToggleVisibility = async () => {
    if (selectedPodcast) {
      const newStatus = selectedPodcast.status === 'visible' ? 'hidden' : 'visible';
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/podcasts/podcasts/${selectedPodcast.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
          setSelectedPodcast({
            ...selectedPodcast,
            status: newStatus
          });
          // Also update list
          setPodcasts(prev => prev.map(p => p.id === selectedPodcast.id ? { ...p, status: newStatus } : p));
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this podcast?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/podcasts/podcasts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setPodcasts(prev => prev.filter(p => p.id !== id));
          if (selectedPodcast?.id === id) setSelectedPodcast(null);
        }
      } catch (error) {
        console.error('Error deleting podcast:', error);
      }
    }
  };

  const renderPlayer = (url: string) => {
    if (!url) return null;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];

        return (
            <div className="aspect-video rounded-xl overflow-hidden mb-3 border border-slate-100 dark:border-slate-800 shadow-xl">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        );
    } else if (url.includes('spotify.com')) {
        const spotifyId = url.split('/').pop()?.split('?')[0];
        let embedType = 'episode'; 
        if (url.includes('track')) embedType = 'track';
        else if (url.includes('playlist')) embedType = 'playlist';
        
        return (
            <div className="rounded-xl overflow-hidden mb-3 border border-slate-100 dark:border-slate-800 shadow-xl">
                <iframe 
                    src={`https://open.spotify.com/embed/${embedType}/${spotifyId}`} 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allow="encrypted-media"
                    className="bg-transparent"
                ></iframe>
            </div>
        );
    } else {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Preview Audio</span>
                    </div>
                    <Headphones size={16} className="text-slate-400" />
                </div>
                <audio key={url} controls className="w-full h-10 block accent-blue-600">
                    <source src={url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        );
    }
  };

  const handlePodcastAdded = () => {
    setIsFormOpen(false);
    fetchPodcasts();
  };

  const filteredPodcasts = podcasts.filter(pod => 
    pod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pod.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pod.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Podcast Episodes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your audio content library and RSS feed.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                    type="text" 
                    placeholder="Search podcasts..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
            </div>
            <button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-3 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
            <Plus size={14} className="mr-2" /> New Episode
            </button>
        </div>
      </div>

      {/* Modern List View */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="w-1/2 pl-4">Episode Details</div>
            <div className="w-1/6">Category</div>
            <div className="w-1/6">Host</div>
            <div className="w-1/6 text-right pr-4">Actions</div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                     <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tuning In...</p>
                     </div>
                </div>
            ) : filteredPodcasts.map((pod) => (
                <div 
                    key={pod.id} 
                    onClick={() => { setSelectedPodcast(pod); setActiveTab('details'); }}
                    className="group flex items-center p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer"
                >
                    {/* Episode Info */}
                    <div className="w-1/2 flex items-center gap-4">
                        <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all border border-slate-200 dark:border-slate-700/60">
                            {pod.coverImage ? (
                                <img src={pod.coverImage} alt={pod.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Mic size={16} className="text-slate-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 text-blue-900 rounded-full p-1.5 shadow-sm scale-90 group-hover:scale-100 transition-transform">
                                    <Play size={14} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{pod.title}</h3>
                                {pod.status === 'hidden' && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] rounded uppercase font-bold tracking-wider border border-slate-300 dark:border-slate-600">Hidden</span>
                                )}
                            </div>
                            
                        </div>
                    </div>

                    {/* Category */}
                    <div className="w-1/6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {pod.category}
                        </span>
                    </div>

                    {/* Host */}
                    <div className="w-1/6 text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center">
                        <UserIcon size={14} className="mr-2 text-slate-400" />
                        {pod.host}
                    </div>

                    {/* Actions */}
                    <div className="w-1/6 flex justify-end gap-2 pr-2 overflow-visible">
                         <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedPodcast(pod); setActiveTab('details'); }}
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="View"
                         >
                            <Eye size={16} />
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(pod.id); }}
                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Delete"
                         >
                            <Trash2 size={16} />
                         </button>
                    </div>
                </div>
            ))}
            {!isLoading && filteredPodcasts.length === 0 && (
                 <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                    No episodes found.
                </div>
            )}
        </div>
      </div>

      {/* Add Podcast Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Upload New Episode" maxWidth="max-w-4xl">
        <PodcastForm onSubmit={handlePodcastAdded} onCancel={() => setIsFormOpen(false)} />
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

             <div className="relative z-10 flex flex-col md:flex-row gap-4 p-4">
                {/* Left: Album Art & Stats */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="w-full aspect-square rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group">
                        <img src={selectedPodcast.coverImage} alt={selectedPodcast.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* Quick Stats */}
                    
                     {/* Engagement Stats Summary */}
                    <div className="flex w-full justify-between mt-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-4 backdrop-blur-md border border-white/10">
                        <div className="flex items-center space-x-2">
                            <Heart className="text-red-500" size={14} fill="currentColor" />
                            <div>
                                <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedPodcast.likes || 0}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Likes</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 border-l border-slate-300 dark:border-slate-700 pl-4">
                            <MessageCircle className="text-blue-500" size={14} fill="currentColor" />
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
                    
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{selectedPodcast.title}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium flex items-center mb-3">
                        <Mic size={18} className="mr-2 text-blue-500" /> 
                        Host: <span className="text-slate-700 dark:text-slate-300 ml-1">{selectedPodcast.host}</span>
                    </p>

                    {/* Player Card */}
                    {renderPlayer(selectedPodcast.audioFile)}

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
                    <div className="min-h-[160px] bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-4">
                        
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
                                    {selectedPodcast.description || "No description provided."}
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
                                    <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">No likes yet.</div>
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
                                    <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">No comments yet.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons - Always Visible */}
                    <div className="mt-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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