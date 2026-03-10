import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, MapPin, Star, Users, Clock, Trash2, Eye, MoreHorizontal, Globe, X, CalendarCheck, EyeOff, Search } from 'lucide-react';
import TravelForm from '../../components/forms/TravelForm';

const API_BASE_URL = 'http://localhost:5000';

// --- Internal Detail Modal Component ---
const DetailModal = ({ destination, onClose, onToggleVisibility, isUpdating, onEdit }) => {
    if (!destination) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop: Ultra-Deep Glassmorphism */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative z-10 w-full max-w-6xl h-[92vh] bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] flex flex-col transition-all border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                
                {/* Top Action Bar - Floating Style */}
                <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
                    <button 
                        onClick={() => onEdit(destination)}
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 group"
                        title="Edit Destination"
                    >
                        <MoreHorizontal size={20} className="group-hover:rotate-90 transition-transform" />
                    </button>
                    <button 
                        onClick={onClose} 
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Left Side: Immersive Hero & Gallery */}
                    <div className="md:w-[45%] h-full bg-slate-100 dark:bg-slate-950 relative border-r border-slate-200 dark:border-slate-800 flex flex-col">
                        {/* Immersive Hero */}
                        <div className="relative h-[65%] w-full overflow-hidden">
                            <img src={destination.hero_image} alt={destination.name} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-900/40 border border-blue-400/30">
                                        {destination.duration}
                                    </span>
                                    <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-yellow-400 gap-1.5 text-[11px] font-bold border border-white/10">
                                        <Star size={14} fill="currentColor" /> {destination.rating}
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border ${destination.status === 'visible' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                                        {destination.status === 'visible' ? 'Active' : 'Private'}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2 leading-tight">
                                    {destination.name}
                                </h2>
                                <div className="flex items-center text-slate-300 text-sm font-medium">
                                    <MapPin size={16} className="mr-2 text-blue-500" />
                                    {destination.location}
                                </div>
                            </div>
                        </div>

                        {/* Side Gallery */}
                        <div className="flex-1 p-6 overflow-hidden">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Discovery Gallery</h4>
                            <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-full scrollbar-hide">
                                {destination.gallery && destination.gallery.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200/50 dark:border-white/5 relative group cursor-zoom-in">
                                        <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </div>
                                ))}
                                {(!destination.gallery || destination.gallery.length === 0) && (
                                    <div className="col-span-3 aspect-[3/1] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-400 text-xs font-medium">
                                        No additional photos available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Detailed Content */}
                    <div className="flex-1 h-full bg-white dark:bg-slate-900 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        <div className="p-8 lg:p-12 space-y-12">
                            {/* Overview Section */}
                            <section className="animate-in slide-in-from-bottom-4 duration-500 delay-150">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Globe size={18} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Adventure Overview</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base font-medium opacity-90">
                                    {destination.description}
                                </p>
                            </section>

                            {/* Logistics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                                {[
                                    { icon: <Users size={18} />, label: "Group Size", value: destination.group_size },
                                    { icon: <Globe size={18} />, label: "Languages", value: destination.languages },
                                    { icon: <Clock size={18} />, label: "Duration", value: destination.duration },
                                    { icon: <CalendarCheck size={18} />, label: "Date Added", value: new Date(destination.created_at).toLocaleDateString() }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex flex-col items-center text-center group hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
                                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors mb-2 shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.value || 'N/A'}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Grid: Highlights & Itinerary */}
                            <div className="grid lg:grid-cols-12 gap-10">
                                {/* Highlights */}
                                <div className="lg:col-span-5 space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                        Premium Highlights
                                    </h3>
                                    <div className="space-y-3">
                                        {destination.highlights && destination.highlights.map((h, i) => (
                                            <div key={i} className="group flex items-start gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/30 transition-all hover:translate-x-1">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
                                                    {i + 1}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Itinerary */}
                                <div className="lg:col-span-12 lg:order-last space-y-8">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                        Planned Journey
                                    </h3>
                                    <div className="relative space-y-4">
                                        {destination.itinerary && destination.itinerary.map((day, i) => (
                                            <div key={i} className="relative pl-12 pb-8 last:pb-0">
                                                {/* Timeline Line */}
                                                {i !== destination.itinerary.length - 1 && (
                                                    <div className="absolute left-[19px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-transparent" />
                                                )}
                                                {/* Timeline Point */}
                                                <div className="absolute left-0 top-0 w-10 h-10 rounded-[1.25rem] bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 flex items-center justify-center z-10 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">D{day.day}</span>
                                                </div>
                                                <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                                    <h4 className="text-slate-900 dark:text-white text-base font-bold mb-2">
                                                        {day.title}
                                                    </h4>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{day.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer: Dynamic Price & Publishing */}
                        <div className="sticky bottom-0 w-full p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between z-20">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {destination.price}
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">/ traveler</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => onToggleVisibility(destination.id)}
                                    disabled={isUpdating}
                                    className={`px-8 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 active:scale-95 ${destination.status === 'visible'
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 text-white'
                                    } ${isUpdating ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isUpdating ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                    ) : (
                                        <>
                                            {destination.status === 'visible' ? <EyeOff size={18} /> : <Eye size={18} />}
                                            {destination.status === 'visible' ? 'Depublish' : 'Go Live Now'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Main Page Component ---
export default function TravelPage() {
    const [destinations, setDestinations] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null); // Track which destination is being updated
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch destinations from API
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/api/travel-destinations/travel-destinations-get`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();

                if (result.success) {
                    setDestinations(result.data);
                } else {
                    setError(result.message || 'Failed to fetch destinations');
                }
            } catch (err) {
                setError('Network error: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setIsFormOpen(true);
        setSelectedDetail(null); // Close detail modal when editing
    };

    const handleViewDetail = (item) => {
        setSelectedDetail(item);
    };

    const handleFormSubmit = (data) => {
        if (editingItem) {
            setDestinations(prev => prev.map(d => d.id === editingItem.id ? { ...data, id: editingItem.id } : d));
        } else {
            setDestinations(prev => [{ ...data, id: Date.now(), created_at: new Date().toISOString(), status: 'visible' }, ...prev]);
        }
        setIsFormOpen(false);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this destination?')) {
            setDestinations(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            setUpdatingStatus(id);

            // Find the destination to get its current status
            const destination = destinations.find(d => d.id === id);
            if (!destination) return;

            // Determine the new status
            const newStatus = destination.status === 'visible' ? 'hidden' : 'visible';

            // Make API call to update status - using the correct endpoint path
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/travel-destinations/travel-destinations-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            // Check if response is ok before parsing JSON
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (result.success) {
                // Update local state with the new status
                setDestinations(prev =>
                    prev.map(dest =>
                        dest.id === id ? { ...dest, status: newStatus } : dest
                    )
                );

                // Update the selected detail if it's open
                if (selectedDetail && selectedDetail.id === id) {
                    setSelectedDetail({ ...selectedDetail, status: newStatus });
                }
            } else {
                alert(`Failed to update status: ${result.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error updating visibility status:', err);
            alert(`Error updating status: ${err.message}`);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredDestinations = destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 p-4">
            {/* Header Section */}
            <div className="w-full mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Travel Destinations</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your tours and travel packages.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm text-white transition-all duration-200 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        <span>New Destination</span>
                    </button>
                </div>
            </div>

            {/* List View (Table) */}
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <th className="p-4 font-medium">Destination</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Duration</th>
                                <th className="p-4 font-medium">Rating</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-5 text-center text-slate-500">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                        <p className="mt-2">Loading destinations...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="7" className="p-5 text-center text-red-500">
                                        Error: {error}
                                    </td>
                                </tr>
                            ) : destinations.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                <MapPin size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">No destinations found</p>
                                            <p className="text-sm mt-1">Add one to get started with your travel packages.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredDestinations.map((dest) => (
                                    <tr
                                        key={dest.id}
                                        onClick={() => handleViewDetail(dest)}
                                        className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${dest.status !== 'visible' ? 'opacity-60' : ''}`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                                    <img src={dest.hero_image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{dest.name}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{dest.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                                <MapPin size={14} className="mr-2 text-slate-400 dark:text-slate-500" />
                                                {dest.location}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-slate-900 dark:text-slate-200">{dest.price}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <Clock size={14} className="mr-2" />
                                                {dest.duration}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{dest.rating}</span>
                                                <span className="text-xs text-slate-500">({dest.reviews})</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${dest.status === 'visible'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {dest.status === 'visible' ? <Eye size={12} /> : <EyeOff size={12} />}
                                                    {dest.status === 'visible' ? 'Visible' : 'Hidden'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleViewDetail(dest); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(dest.id, e)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Form Modal */}
            <TravelForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingItem}
                onSuccess={handleFormSubmit}
            />

            {/* Read-Only Detail Modal */}
            <DetailModal
                destination={selectedDetail}
                onClose={() => setSelectedDetail(null)}
                onToggleVisibility={handleToggleVisibility}
                isUpdating={updatingStatus === selectedDetail?.id}
                onEdit={handleOpenEdit}
            />
        </div>
    );
}