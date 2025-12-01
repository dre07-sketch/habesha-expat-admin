

import React, { useState } from 'react';
import { Plus, Eye, CheckCircle, XCircle, MapPin, Globe, Phone, Mail, Calendar, ExternalLink, Map, Hash, Clock, ShieldCheck, Star, MessageSquare, ThumbsUp, Filter, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import B2BForm from '../../components/forms/B2BForm';
import { MOCK_BUSINESSES } from '../../constants';
import { Business } from '../../types';

const B2B: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBusinesses = MOCK_BUSINESSES.filter(biz => 
    biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">B2B Requests</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and approve business listings for the directory.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search businesses..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
            </div>
            <button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
            <Plus size={20} className="mr-2" /> Add Business
            </button>
        </div>
      </div>

      {/* Modern Card-Like Table */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Info</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800/0 divide-y divide-slate-200 dark:divide-slate-700/60">
                {filteredBusinesses.map((biz) => (
                <tr key={biz.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-200">
                    <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-blue-500/50 transition-colors">
                                    <img className="h-full w-full object-cover" src={biz.image} alt="" />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-slate-800 rounded-full ${biz.status === 'approved' ? 'bg-emerald-500' : biz.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{biz.name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                                    <Mail size={12} className="mr-1" /> {biz.email}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {biz.category}
                        </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase tracking-wide rounded-full ${
                        biz.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                            : biz.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}>
                        {biz.status}
                    </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => setSelectedBusiness(biz)} 
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Details"
                    >
                        <Eye size={20} />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {filteredBusinesses.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No businesses found matching your search.
                </div>
            )}
        </div>
      </div>

      {/* Add Form Popup */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add New Business">
        <B2BForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Details Popup - WIDE Container + Bottom Actions */}
      <Modal isOpen={!!selectedBusiness} onClose={() => setSelectedBusiness(null)} title="Business Profile" maxWidth="max-w-5xl">
        {selectedBusiness && (
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col">
            
            {/* Hero Section */}
            <div className="relative h-64 w-full group shrink-0">
                <img src={selectedBusiness.image} alt={selectedBusiness.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide shadow-lg">{selectedBusiness.category}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide shadow-lg text-white ${selectedBusiness.status === 'approved' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                                    {selectedBusiness.status}
                                </span>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-1 tracking-tight shadow-black drop-shadow-md">{selectedBusiness.name}</h2>
                            <div className="flex items-center text-slate-300 text-sm font-medium">
                                <Calendar size={14} className="mr-1.5" /> Added on Oct 24, 2025
                            </div>
                        </div>
                         {/* Header Rating Badge */}
                        {selectedBusiness.rating && (
                            <div className="hidden sm:flex bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex-col items-center">
                                <div className="flex items-center space-x-1">
                                    <Star className="text-yellow-400 fill-yellow-400" size={24} />
                                    <span className="text-3xl font-bold text-white">{selectedBusiness.rating}</span>
                                </div>
                                <span className="text-xs text-white/80 font-medium">Overall Rating</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Content Wrapper */}
            <div className="p-8 bg-slate-50 dark:bg-[#0B1121] space-y-8">
                
                {/* Top Section: Contact Info & Map */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Contact & Metadata */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Contact Info Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            
                            <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 flex items-center relative z-10">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                                Contact Information
                            </h3>

                            <div className="space-y-5 relative z-10">
                                {/* Email Item */}
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div className="ml-4 overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                        <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{selectedBusiness.email}</p>
                                    </div>
                                </div>

                                {/* Phone Item */}
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div className="ml-4 overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                                        <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{selectedBusiness.phone}</p>
                                    </div>
                                </div>

                                {/* Website Item */}
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shrink-0">
                                        <Globe size={18} />
                                    </div>
                                    <div className="ml-4 overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Website</p>
                                        <a href={selectedBusiness.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate hover:underline flex items-center">
                                            Visit Site <ExternalLink size={10} className="ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <h3 className="text-slate-800 dark:text-white font-bold text-xs mb-4 uppercase tracking-wide flex items-center">
                                <ShieldCheck size={14} className="mr-2 text-slate-400" /> Verification
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center"><Hash size={12} className="mr-2"/> ID</span>
                                    <span className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">#{selectedBusiness.id.toString().padStart(4, '0')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center"><Clock size={12} className="mr-2"/> Updated</span>
                                    <span className="text-slate-700 dark:text-slate-300">2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Location & Map */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col">
                            <div className="p-5 pb-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                                    <MapPin size={16} className="text-red-500 mr-2" />
                                    Location Details
                                </h3>
                                <p className="text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-medium pl-6">{selectedBusiness.address}</p>
                            </div>
                            
                            {/* Map View */}
                            <div className="flex-1 p-2">
                                <div className="relative w-full h-64 lg:h-full bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-inner group cursor-pointer min-h-[250px]">
                                    <div className="absolute inset-0 bg-[url('https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif')] bg-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                                    <div className="relative z-10 flex flex-col items-center text-slate-500 dark:text-slate-300 bg-white/90 dark:bg-black/70 p-4 rounded-2xl backdrop-blur-sm shadow-2xl border border-slate-200 dark:border-slate-600">
                                        <Map className="mb-2 text-blue-500" size={32} />
                                        <span className="font-mono text-sm font-bold mb-1">Lat/Lon Coordinates</span>
                                        <span className="text-xs opacity-70">{selectedBusiness.mapPin}</span>
                                        <button className="mt-3 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">
                                            Open in Google Maps
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings & Reviews Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                            <Star className="text-yellow-500 mr-2" fill="currentColor" size={24} /> Ratings & Reviews
                        </h3>
                        <div className="flex gap-2">
                             <button className="flex items-center text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                                <Filter size={14} className="mr-1.5" /> Filter
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                         {/* Left: Summary Stats */}
                         <div className="lg:col-span-1 space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                                <div className="text-5xl font-extrabold text-slate-800 dark:text-white mb-2">{selectedBusiness.rating || '0.0'}</div>
                                <div className="flex justify-center space-x-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={20} className={s <= Math.round(selectedBusiness.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-600"} />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Based on {selectedBusiness.reviews?.length || 0} reviews</p>
                            </div>

                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((stars, i) => {
                                    // Mock percentage logic for demo visual
                                    const percent = stars === 5 ? 70 : stars === 4 ? 20 : 5; 
                                    return (
                                        <div key={stars} className="flex items-center text-sm">
                                            <span className="w-8 font-bold text-slate-600 dark:text-slate-400 flex items-center">{stars} <Star size={10} className="ml-0.5 text-slate-400" /></span>
                                            <div className="flex-1 mx-3 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }}></div>
                                            </div>
                                            <span className="w-8 text-right text-slate-400 text-xs">{percent}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                         </div>

                         {/* Right: Reviews List */}
                         <div className="lg:col-span-2">
                             <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Latest Feedback</h4>
                             <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {selectedBusiness.reviews && selectedBusiness.reviews.length > 0 ? (
                                    selectedBusiness.reviews.map((review) => (
                                        <div key={review.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center">
                                                    <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600" />
                                                    <div className="ml-3">
                                                        <div className="font-bold text-slate-800 dark:text-white text-sm">{review.user}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">{review.date}</div>
                                                    </div>
                                                </div>
                                                <div className="flex bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} size={12} className={s <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-300 dark:text-slate-600"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">{review.comment}</p>
                                            <div className="flex items-center space-x-4">
                                                 <button className="flex items-center text-xs text-slate-400 hover:text-blue-500 transition-colors font-medium">
                                                    <ThumbsUp size={12} className="mr-1" /> Helpful
                                                 </button>
                                                  <button className="flex items-center text-xs text-slate-400 hover:text-blue-500 transition-colors font-medium">
                                                    <MessageSquare size={12} className="mr-1" /> Reply
                                                 </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <Star size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">No reviews yet.</p>
                                        <p className="text-xs text-slate-400 mt-1">Be the first to leave a review!</p>
                                    </div>
                                )}
                             </div>
                         </div>
                    </div>
                </div>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="bg-white dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0 z-20">
                <div className="flex items-center text-slate-500 text-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                    Reviewing listing for approval...
                </div>
                <div className="flex space-x-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none py-3 px-6 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 rounded-xl font-bold transition-all flex items-center justify-center">
                        <XCircle size={18} className="mr-2" /> Reject
                    </button>
                    <button className="flex-1 sm:flex-none py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center transform hover:-translate-y-0.5">
                        <CheckCircle size={18} className="mr-2" /> Approve Listing
                    </button>
                </div>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default B2B;