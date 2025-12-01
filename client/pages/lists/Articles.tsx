

import React, { useState } from 'react';
import { Plus, Edit3, Calendar, User, Tag, Clock, Eye, ChevronRight, FileText, Share2, Bookmark, EyeOff, UploadCloud, Heart, MessageCircle, BarChart2, ThumbsUp, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import ArticleForm from '../../components/forms/ArticleForm';
import { MOCK_ARTICLES } from '../../constants';
import { Article } from '../../types';

const Articles: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [activeTab, setActiveTab] = useState<'content' | 'engagement'>('content');
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleStatus = () => {
    if (selectedArticle) {
        const newStatus: 'draft' | 'published' = selectedArticle.status === 'published' ? 'draft' : 'published';
        const updatedArticle: Article = { ...selectedArticle, status: newStatus };
        
        // Update selected article view
        setSelectedArticle(updatedArticle);
        
        // Update list view
        setArticles(articles.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    }
  };

  const handleOpenArticle = (article: Article) => {
    setSelectedArticle(article);
    setActiveTab('content'); // Reset tab to content on open
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Articles & Blog</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage editorial content, news, and stories.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search articles..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
            </div>
            <button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
            <Plus size={20} className="mr-2" /> New Article
            </button>
        </div>
      </div>

      {/* Cool List View */}
      <div className="space-y-3">
        {filteredArticles.map((article) => (
            <div 
                key={article.id} 
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all cursor-pointer group" 
                onClick={() => handleOpenArticle(article)}
            >
                {/* Thumbnail */}
                <div className="relative w-full md:w-64 h-40 shrink-0 rounded-xl overflow-hidden">
                    <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 dark:text-white shadow-sm flex items-center">
                        <Tag size={10} className="mr-1 text-blue-500" /> {article.category}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-4">{article.title}</h3>
                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${article.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'}`}>
                                {article.status}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span className="flex items-center"><Calendar size={12} className="mr-1.5 text-slate-400" /> {article.publishDate}</span>
                            <span className="flex items-center"><User size={12} className="mr-1.5 text-slate-400" /> {article.author}</span>
                             <span className="flex items-center"><Heart size={12} className="mr-1.5 text-slate-400" /> {article.likes || 0}</span>
                             <span className="flex items-center"><MessageCircle size={12} className="mr-1.5 text-slate-400" /> {article.comments || 0}</span>
                        </div>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                            Read Article <ChevronRight size={14} className="ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        ))}
        {filteredArticles.length === 0 && (
             <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No articles found.
            </div>
        )}
      </div>

      {/* New Article Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Draft New Article" maxWidth="max-w-5xl">
        <ArticleForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Immersive Reader & Engagement Modal */}
      <Modal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} title="Article Preview" maxWidth="max-w-5xl">
        {selectedArticle && (
            <div className="bg-white dark:bg-slate-900 flex flex-col relative rounded-b-xl overflow-hidden">
                <div className="min-h-[60vh]">
                    {/* Hero Header */}
                    <div className="relative h-80 w-full rounded-t-xl md:rounded-xl overflow-hidden mb-0 group">
                        <img src={selectedArticle.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-95"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                            <div className="max-w-4xl">
                                <div className="flex flex-wrap gap-3 mb-4">
                                     <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-900/20 uppercase tracking-wide">
                                        {selectedArticle.category}
                                    </span>
                                     <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide ${selectedArticle.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                        {selectedArticle.status}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight shadow-black drop-shadow-lg">{selectedArticle.title}</h1>
                                
                                <div className="flex items-center space-x-6 text-slate-200 text-sm font-medium">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm border border-white/20">
                                            <User size={14} className="text-white" />
                                        </div>
                                        <span>{selectedArticle.author}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-2 opacity-70" /> {selectedArticle.publishDate}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-2 opacity-70" /> 5 min read
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                        <div className="flex w-full">
                            <button 
                                onClick={() => setActiveTab('content')}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'content' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                            >
                                Article Content
                            </button>
                            <button 
                                onClick={() => setActiveTab('engagement')}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'engagement' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                            >
                                Engagement & Feedback
                            </button>
                        </div>
                    </div>

                    <div className="px-4 md:px-12 max-w-5xl mx-auto py-10">
                        
                        {/* TAB 1: CONTENT */}
                        {activeTab === 'content' && (
                            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-loose">
                                    <p className="lead text-xl text-slate-500 dark:text-slate-400 font-serif italic border-l-4 border-blue-500 pl-4 mb-8">
                                        {selectedArticle.excerpt}
                                    </p>
                                    <div className="whitespace-pre-line font-serif text-lg">
                                        {selectedArticle.content}
                                    </div>
                                </div>

                                {/* Article Footer */}
                                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        {['#business', '#ethiopia', '#investment'].map(tag => (
                                            <span key={tag} className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="p-2 rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                            <Share2 size={20} />
                                        </button>
                                        <button className="p-2 rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                            <Bookmark size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: ENGAGEMENT & COMMENTS */}
                        {activeTab === 'engagement' && (
                            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                                {/* Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-2xl border border-blue-100 dark:border-slate-700 flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Views</p>
                                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{selectedArticle.views?.toLocaleString() || '1,204'}</h3>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm">
                                            <BarChart2 size={24} />
                                        </div>
                                     </div>
                                     <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-2xl border border-rose-100 dark:border-slate-700 flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Likes</p>
                                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{selectedArticle.likes?.toLocaleString() || '0'}</h3>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-xl text-rose-500 shadow-sm">
                                            <Heart size={24} fill="currentColor" />
                                        </div>
                                     </div>
                                     <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/50 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Comments</p>
                                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{selectedArticle.comments?.toLocaleString() || '0'}</h3>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-700 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                                            <MessageCircle size={24} />
                                        </div>
                                     </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Comments Column */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                                            <MessageCircle className="mr-2 text-blue-500" size={20} /> Discussion ({selectedArticle.comments || 0})
                                        </h3>
                                        
                                        <div className="space-y-6">
                                            {selectedArticle.commentList && selectedArticle.commentList.length > 0 ? (
                                                selectedArticle.commentList.map(comment => (
                                                    <div key={comment.id} className="flex gap-4 group">
                                                        <img src={comment.avatar} alt={comment.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm shrink-0" />
                                                        <div className="flex-1">
                                                            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-shadow">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{comment.name}</span>
                                                                    <span className="text-xs text-slate-400">{comment.date}</span>
                                                                </div>
                                                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{comment.text}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-1 pl-2">
                                                                <button className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors">Like</button>
                                                                <button className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors">Reply</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                                    <MessageCircle size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                                    <p className="text-slate-500 dark:text-slate-400">No comments yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Likes / Recent Activity Column */}
                                    <div className="lg:col-span-1 space-y-6">
                                         <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                                            <Heart className="mr-2 text-rose-500" size={20} /> Recent Likes
                                        </h3>
                                        
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                            {selectedArticle.likedBy && selectedArticle.likedBy.length > 0 ? (
                                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                                    {selectedArticle.likedBy.map(user => (
                                                        <div key={user.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600" />
                                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 font-medium">{user.date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">No likes recorded yet.</div>
                                            )}
                                            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 text-center border-t border-slate-100 dark:border-slate-700">
                                                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View All Likes</button>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-blue-100 dark:border-slate-700 mt-6">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Performance Tip</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                Articles published on Tuesday mornings tend to get 20% more engagement. Consider sharing this on social media now.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Sticky Bottom Actions */}
                <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium mr-2">Current Status:</span>
                        <span className={`uppercase font-bold text-sm px-2 py-0.5 rounded ${selectedArticle.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                            {selectedArticle.status}
                        </span>
                    </div>
                    
                    <div className="flex space-x-3 w-full sm:w-auto">
                        {selectedArticle.status === 'published' ? (
                            <button 
                                onClick={handleToggleStatus}
                                className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all"
                            >
                                <EyeOff size={18} className="mr-2" /> Unpublish
                            </button>
                        ) : (
                            <button 
                                onClick={handleToggleStatus}
                                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all shadow-lg shadow-emerald-600/20"
                            >
                                <Eye size={18} className="mr-2" /> Publish Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Articles;