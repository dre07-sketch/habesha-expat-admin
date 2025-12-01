
import React, { useState } from 'react';
import { Plus, Tag, Layers, Trash2, Hash, FileText, Mic, Video, Briefcase, LayoutGrid, FolderOpen, ChevronRight, BarChart3 } from 'lucide-react';
import Modal from '../../components/Modal';
import CategoryForm from '../../components/forms/CategoryForm';
import { MOCK_CATEGORIES } from '../../constants';
import { Category } from '../../types';

const Categories: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category? Content tagged with it may be affected.')) {
        setCategories(categories.filter(c => c.id !== id));
    }
  };

  // Helper to get icon and color based on type
  const getTypeConfig = (type: string) => {
    switch (type) {
        case 'Article': return { icon: FileText, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' };
        case 'Podcast': return { icon: Mic, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' };
        case 'Video': return { icon: Video, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800' };
        case 'Business': return { icon: Briefcase, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' };
        default: return { icon: Layers, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' };
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Content Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your platform's taxonomy and tags.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={20} className="mr-2" /> Add Category
        </button>
      </div>

      {/* Cool List View */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="w-5/12 pl-4">Category Name</div>
            <div className="w-3/12">Content Type</div>
            <div className="w-2/12">Usage</div>
            <div className="w-2/12 text-right pr-4">Actions</div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {categories.map((cat) => {
                const style = getTypeConfig(cat.type);
                const Icon = style.icon;
                
                return (
                    <div 
                        key={cat.id} 
                        className="group flex items-center p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {/* Name & Icon */}
                        <div className="w-5/12 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.color} shadow-sm`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                                    <Hash size={10} className="mr-0.5" /> {cat.name.toLowerCase().replace(/\s+/g, '-')}
                                </div>
                            </div>
                        </div>

                        {/* Content Type */}
                        <div className="w-3/12">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${style.color.replace('bg-', 'border-').replace('text-', 'border-').split(' ')[0]} bg-opacity-10`}>
                                {cat.type}
                            </span>
                        </div>

                        {/* Usage Stats */}
                        <div className="w-2/12">
                            <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                                <Layers size={16} className="mr-2 text-slate-400" /> 42 Items
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="w-2/12 flex justify-end items-center pr-2 space-x-2">
                             <button 
                                onClick={(e) => handleDelete(cat.id, e)}
                                className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                title="Delete Category"
                             >
                                <Trash2 size={18} />
                             </button>
                             <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="New Category" maxWidth="max-w-2xl">
        <CategoryForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Immersive Details Modal */}
      <Modal isOpen={!!selectedCategory} onClose={() => setSelectedCategory(null)} title="Category Insight" maxWidth="max-w-3xl">
        {selectedCategory && (
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                {/* Header Gradient */}
                <div className={`h-40 w-full bg-gradient-to-r relative overflow-hidden flex items-center px-8 ${
                    selectedCategory.type === 'Article' ? 'from-indigo-600 to-blue-600' : 
                    selectedCategory.type === 'Video' ? 'from-sky-600 to-cyan-600' :
                    selectedCategory.type === 'Podcast' ? 'from-rose-600 to-pink-600' :
                    'from-emerald-600 to-green-600'
                }`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/10 to-transparent"></div>
                    
                    <div className="relative z-10 flex items-center w-full">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-white shadow-xl border border-white/20 mr-6">
                            {React.createElement(getTypeConfig(selectedCategory.type).icon, { size: 40 })}
                        </div>
                        <div>
                            <div className="flex items-center space-x-3 mb-1">
                                <span className="text-white/80 text-xs font-bold uppercase tracking-widest border border-white/30 px-2 py-0.5 rounded-full">{selectedCategory.type}</span>
                                <span className="text-white/60 text-xs flex items-center"><Hash size={12} className="mr-0.5"/> ID: {selectedCategory.id}</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white shadow-black drop-shadow-md">{selectedCategory.name}</h2>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                            <Layers className="text-blue-500 mb-2" size={24} />
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">42</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Total Items</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                            <BarChart3 className="text-emerald-500 mb-2" size={24} />
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">12.5k</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Monthly Views</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                            <FolderOpen className="text-purple-500 mb-2" size={24} />
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">Active</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Status</span>
                        </div>
                    </div>

                    {/* SEO & Metadata */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                            SEO Preview
                        </h3>
                        <div className="flex items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-300">
                            <span className="text-slate-400 select-none">habeshaexpat.com/category/</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedCategory.name.toLowerCase().replace(/\s+/g, '-')}</span>
                        </div>
                    </div>

                    {/* Recent Items Preview */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                                <LayoutGrid size={18} className="mr-2 text-slate-400" /> Recent {selectedCategory.type}s
                            </h3>
                            <button className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">View All Content</button>
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 mr-4 flex items-center justify-center text-slate-400 text-xs font-bold group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors shadow-sm">IMG</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Sample Content Title {i}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Published 2 days ago • 1.2k views</div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Categories;
