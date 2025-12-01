

import React, { useState } from 'react';
import { Plus, Play, Calendar, Eye, Heart, MessageCircle, EyeOff, Trash2, MoreVertical, ThumbsUp, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import VideoForm from '../../components/forms/VideoForm';
import { MOCK_VIDEOS } from '../../constants';
import { Video } from '../../types';

const Videos: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [activeTab, setActiveTab] = useState<'details' | 'likes' | 'comments'>('details');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this video?')) {
        setVideos(videos.filter(v => v.id !== id));
    }
  };

  const handleToggleVisibility = () => {
    if (selectedVideo) {
      const updatedVideo = {
        ...selectedVideo,
        status: selectedVideo.status === 'visible' ? 'hidden' : 'visible' as 'visible' | 'hidden'
      };
      setSelectedVideo(updatedVideo);
      setVideos(videos.map(v => v.id === updatedVideo.id ? updatedVideo : v));
    }
  };

  const filteredVideos = videos.filter(vid =>
    vid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vid.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Video Content</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage video uploads, descriptions and visibility.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search videos..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
            </div>
            <button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
            <Plus size={20} className="mr-2" /> Upload Video
            </button>
        </div>
      </div>

      {/* List View */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="w-5/12 pl-4">Video</div>
            <div className="w-2/12">Category</div>
            <div className="w-2/12">Stats</div>
            <div className="w-2/12">Status</div>
            <div className="w-1/12 text-right pr-4">Action</div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredVideos.map((vid) => (
                 <div 
                    key={vid.id} 
                    onClick={() => { setSelectedVideo(vid); setActiveTab('details'); }}
                    className="group flex items-center p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer"
                 >
                    {/* Video Info */}
                    <div className="w-5/12 flex items-center gap-4">
                        <div className="relative w-32 aspect-video shrink-0 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-blue-500/50 transition-colors">
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{vid.duration}</div>
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={24} className="text-white drop-shadow-lg" fill="currentColor" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{vid.title}</h3>
                             <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                                <Calendar size={12} className="mr-1" /> <span>{vid.uploadDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                     <div className="w-2/12">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {vid.category}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="w-2/12 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center mb-1">
                            <Eye size={12} className="mr-1.5 text-blue-500" /> {vid.views?.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                            <Heart size={12} className="mr-1.5 text-red-500" /> {vid.likes?.toLocaleString()}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="w-2/12">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${vid.status === 'visible' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                             {vid.status === 'visible' ? <Eye size={12} className="mr-1.5"/> : <EyeOff size={12} className="mr-1.5"/>}
                             {vid.status}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="w-1/12 flex justify-end pr-2">
                         <button 
                            onClick={(e) => handleDelete(vid.id, e)}
                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete Video"
                         >
                            <Trash2 size={18} />
                         </button>
                    </div>

                 </div>
            ))}
            {filteredVideos.length === 0 && (
                 <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No videos found.
                </div>
            )}
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add New Video">
        <VideoForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Video Details Modal - Theater Mode */}
      <Modal isOpen={!!selectedVideo} onClose={() => setSelectedVideo(null)} title="Video Manager" maxWidth="max-w-5xl">
        {selectedVideo && (
          <div className="flex flex-col space-y-6">
             
             {/* Video Player Container - Reduced Size */}
             <div className="w-full max-w-4xl mx-auto">
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl relative group" style={{ height: '400px' }}>
                    <video controls className="w-full h-full object-contain">
                        <source src={selectedVideo.videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
             </div>

             {/* Tabs */}
             <div className="flex border-b border-slate-200 dark:border-slate-700 mb-2">
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
                    Likes ({selectedVideo.likes || 0})
                </button>
                <button 
                    onClick={() => setActiveTab('comments')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 rounded-t-lg ${activeTab === 'comments' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                    Comments ({selectedVideo.comments || 0})
                </button>
             </div>

             {/* Tab Content Area */}
             <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-6 border border-slate-100 dark:border-slate-800 min-h-[300px]">
                
                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Metadata & Description */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">{selectedVideo.category}</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center"><Calendar size={12} className="mr-1"/> {selectedVideo.uploadDate}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{selectedVideo.title}</h2>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Engagement Bar */}
                            <div className="flex items-center space-x-6 py-4 border-y border-slate-200 dark:border-slate-800">
                                <div className="flex items-center space-x-2" title="Views">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedVideo.views?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold">Views</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2" title="Likes">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500">
                                        <Heart size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedVideo.likes?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold">Likes</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2" title="Comments">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-500">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-slate-800 dark:text-white">{selectedVideo.comments?.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold">Comments</div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide mb-2">Description</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedVideo.description}</p>
                            </div>
                        </div>

                        {/* Sidebar Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide mb-4">Visibility Control</h3>
                                
                                <div className="mb-4">
                                    <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${selectedVideo.status === 'visible' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                        <span className="flex items-center font-bold text-sm">
                                            {selectedVideo.status === 'visible' ? <Eye size={16} className="mr-2" /> : <EyeOff size={16} className="mr-2" />}
                                            Current: {selectedVideo.status}
                                        </span>
                                    </div>
                                </div>

                                {selectedVideo.status === 'visible' ? (
                                    <button 
                                        onClick={handleToggleVisibility}
                                        className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border border-slate-300 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-800 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center"
                                    >
                                        <EyeOff size={16} className="mr-2" /> Take Down Video
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleToggleVisibility}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center shadow-lg shadow-emerald-600/20"
                                    >
                                        <Eye size={16} className="mr-2" /> Make Visible
                                    </button>
                                )}
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide mb-4">Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Slug</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">{selectedVideo.slug}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Duration</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-300">{selectedVideo.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LIKES TAB */}
                {activeTab === 'likes' && (
                    <div className="space-y-2 max-w-3xl mx-auto">
                        {(selectedVideo.likedBy && selectedVideo.likedBy.length > 0) ? (
                            selectedVideo.likedBy.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center space-x-4">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" />
                                        <span className="text-base font-bold text-slate-800 dark:text-white">{user.name}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                                        <ThumbsUp size={12} className="mr-1" /> {user.date}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">No likes yet.</div>
                        )}
                    </div>
                )}

                {/* COMMENTS TAB */}
                {activeTab === 'comments' && (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {(selectedVideo.commentList && selectedVideo.commentList.length > 0) ? (
                            selectedVideo.commentList.map(comment => (
                                <div key={comment.id} className="flex space-x-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <img src={comment.avatar} alt={comment.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{comment.name}</span>
                                            <span className="text-xs text-slate-400">{comment.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">No comments yet.</div>
                        )}
                    </div>
                )}

             </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default Videos;