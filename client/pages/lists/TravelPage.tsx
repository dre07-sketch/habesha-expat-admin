import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, MapPin, Star, Users, Clock, Edit3, Trash2, Eye, MoreHorizontal, Globe, X, CalendarCheck } from 'lucide-react';
import TravelForm from '../../components/forms/TravelForm';

// Mock Data
const MOCK_DESTINATIONS = [
    {
        id: 1,
        slug: 'simien-mountains-trek',
        name: 'Simien Mountains',
        title: 'Roof of Africa Expedition',
        description: 'Experience the breathtaking landscapes of the Simien Mountains, home to the Gelada baboons and Walia ibex. A trekking experience like no other in the horn of Africa.',
        price: '$1,200',
        rating: 4.8,
        reviews: 124,
        hero_image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80',
        location: 'Amhara Region, Ethiopia',
        duration: '4 Days',
        group_size: '10 Max',
        languages: 'Eng, Amh',
        highlights: ['Gelada Baboons', 'Ras Dashen', 'Camping under stars', 'Walia Ibex sighting'],
        itinerary: [
            { day: 1, title: 'Arrival in Gondar', description: 'Fly to Gondar, meet the team and drive to Sankaber.' },
            { day: 2, title: 'Sankaber to Geech', description: 'Trek along the escarpment with stunning views.' },
            { day: 3, title: 'Geech to Chenek', description: 'The most spectacular day, spotting Walia Ibex.' },
            { day: 4, title: 'Chenek to Gondar', description: 'Drive back to Gondar for farewell dinner.' }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80',
            'https://images.unsplash.com/photo-1523539385317-0985c49b6d85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
        ]
    },
    {
        id: 2,
        slug: 'lalibela-churches',
        name: 'Lalibela',
        title: 'The New Jerusalem',
        description: 'Walk through the rock-hewn churches of Lalibela, a UNESCO World Heritage site and a marvel of engineering.',
        price: '$850',
        rating: 4.9,
        reviews: 312,
        hero_image: 'https://images.unsplash.com/photo-1523539385317-0985c49b6d85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
        location: 'Lalibela, Ethiopia',
        duration: '3 Days',
        group_size: '15 Max',
        languages: 'Eng, Fra',
        highlights: ['St. George Church', 'Underground Tunnels', 'Traditional Coffee Ceremony'],
        itinerary: [
            { day: 1, title: 'Northern Group', description: 'Visit the first group of churches.' },
            { day: 2, title: 'Southern Group & St. George', description: 'Visit the famous cross-shaped church.' }
        ],
        gallery: []
    }
];

// --- Internal Detail Modal Component ---
const DetailModal = ({ destination, onClose }) => {
    if (!destination) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop: Neutral Gray Transparency */}
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Modal Container with highest z-index */}
            <div className="relative z-[80] w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all">
                    <X size={18} />
                </button>

                {/* Hero Image Section */}
                <div className="relative h-72 w-full shrink-0">
                    <img src={destination.hero_image} alt={destination.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                        {/* Badges Row */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-600 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{destination.duration}</span>
                            <div className="flex items-center text-yellow-500 gap-1 text-[11px] font-bold">
                                <Star size={12} fill="currentColor" /> {destination.rating}
                            </div>
                        </div>

                        {/* Title & Location */}
                        <h2 className="text-3xl font-bold tracking-tight mb-1">{destination.name}</h2>
                        <div className="flex items-center text-slate-300 text-xs font-medium">
                            <MapPin size={14} className="mr-1.5 text-blue-500" />
                            {destination.location}
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Left Column: Main Info */}
                        <div className="lg:col-span-2 space-y-9">
                            {/* Overview */}
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Overview</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                    {destination.description}
                                </p>
                            </div>

                            {/* Highlights */}
                            {destination.highlights && destination.highlights.length > 0 && (
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Highlights</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {destination.highlights.map((h, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-xs font-medium bg-gray-100 dark:bg-gray-800 px-3 py-2.5 rounded-md border border-gray-200 dark:border-gray-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                {h}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Itinerary */}
                            {destination.itinerary && destination.itinerary.length > 0 && (
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Itinerary</h3>
                                    <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 space-y-6 pb-2">
                                        {destination.itinerary.map((day, i) => (
                                            <div key={i} className="pl-6 relative">
                                                <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white dark:bg-slate-900" />
                                                <h4 className="text-slate-900 dark:text-white text-sm font-bold mb-0.5">
                                                    Day {day.day}: <span className="font-normal text-slate-500 dark:text-slate-400">{day.title}</span>
                                                </h4>
                                                <p className="text-slate-400 dark:text-slate-500 text-xs leading-normal mt-1">{day.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Sidebar Stats */}
                        <div className="space-y-6">
                            {/* Price Card */}
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="mb-6">
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{destination.price}</div>
                                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Per Person</div>
                                </div>

                                <div className="space-y-3.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center text-slate-500 dark:text-slate-400 gap-2"><Users size={14} className="text-slate-400" /> Group Size</span>
                                        <span className="text-slate-700 dark:text-slate-200 font-medium">{destination.group_size}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center text-slate-500 dark:text-slate-400 gap-2"><Globe size={14} className="text-slate-400" /> Languages</span>
                                        <span className="text-slate-700 dark:text-slate-200 font-medium">{destination.languages}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center text-slate-500 dark:text-slate-400 gap-2"><CalendarCheck size={14} className="text-slate-400" /> Created</span>
                                        <span className="text-slate-700 dark:text-slate-200 font-medium">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Header */}
                            {destination.gallery && destination.gallery.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gallery</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {destination.gallery.map((img, idx) => (
                                            <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                                                <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
    const [destinations, setDestinations] = useState(MOCK_DESTINATIONS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null); // For detail popup
    const [editingItem, setEditingItem] = useState(null);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item, e) => {
        e.stopPropagation();
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleViewDetail = (item) => {
        setSelectedDetail(item);
    };

    const handleFormSubmit = (data) => {
        if (editingItem) {
            setDestinations(prev => prev.map(d => d.id === editingItem.id ? { ...data, id: editingItem.id } : d));
        } else {
            setDestinations(prev => [{ ...data, id: Date.now(), created_at: new Date().toISOString() }, ...prev]);
        }
        setIsFormOpen(false);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this destination?')) {
            setDestinations(prev => prev.filter(d => d.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 p-8">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Travel Destinations</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your tours and travel packages.</p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 font-medium text-sm text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                >
                    <Plus size={18} />
                    <span>New Destination</span>
                </button>
            </div>

            {/* List View (Table) */}
            <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <th className="p-4 font-medium">Destination</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Duration</th>
                                <th className="p-4 font-medium">Rating</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {destinations.map((dest) => (
                                <tr
                                    key={dest.id}
                                    onClick={() => handleViewDetail(dest)}
                                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
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
                                                onClick={(e) => handleEdit(dest, e)}
                                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 size={18} />
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
                            ))}
                        </tbody>
                    </table>

                    {destinations.length === 0 && (
                        <div className="p-10 text-center text-slate-500">
                            No destinations found. Add one to get started.
                        </div>
                    )}
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
            />

        </div>
    );
}