

import { Business, Podcast, Video, Article, Subscriber, Newsletter, Event, Ad, Category, User, Job, JobApplicant, SystemStatus } from './types';

export const MOCK_BUSINESSES: Business[] = [
  { 
    id: 1, 
    name: 'Abyssinia Coffee', 
    category: 'Food & Drink', 
    email: 'contact@abyssinia.com', 
    phone: '+1 555-0123', 
    address: '123 Main St, DC', 
    mapPin: '38.9072,-77.0369', 
    image: 'https://picsum.photos/200/300', 
    website: 'https://abyssinia.com', 
    status: 'pending',
    rating: 4.8,
    reviews: [
      { id: 1, user: 'Kebede G.', avatar: 'https://i.pravatar.cc/150?u=50', rating: 5, date: '2 days ago', comment: 'Best coffee in town! The atmosphere is amazing.' },
      { id: 2, user: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?u=51', rating: 4, date: '1 week ago', comment: 'Great service, but a bit crowded on weekends.' },
      { id: 3, user: 'John D.', avatar: 'https://i.pravatar.cc/150?u=52', rating: 5, date: '2 weeks ago', comment: 'Authentic taste.' }
    ]
  },
  { 
    id: 2, 
    name: 'Addis Tech Solutions', 
    category: 'Technology', 
    email: 'info@addistech.com', 
    phone: '+251 911-0000', 
    address: 'Bole Road, Addis Ababa', 
    mapPin: '9.0300,38.7400', 
    image: 'https://picsum.photos/200/301', 
    website: 'https://addistech.com', 
    status: 'approved',
    rating: 4.2
  },
  { 
    id: 3, 
    name: 'Nile Legal Services', 
    category: 'Professional Services', 
    email: 'legal@nile.com', 
    phone: '+44 20-1234', 
    address: 'London, UK', 
    mapPin: '51.5074,-0.1278', 
    image: 'https://picsum.photos/200/302', 
    website: 'https://nilelegal.com', 
    status: 'rejected',
    rating: 3.5
  },
  { 
    id: 4, 
    name: 'Habesha Market', 
    category: 'Retail', 
    email: 'shop@habeshamarket.com', 
    phone: '+1 206-555-0199', 
    address: 'Seattle, WA', 
    mapPin: '47.6062,-122.3321', 
    image: 'https://picsum.photos/200/303', 
    website: 'https://habeshamarket.com', 
    status: 'approved',
    rating: 4.9
  }
];

export const MOCK_PODCASTS: Podcast[] = [
  { id: 1, title: 'Diaspora Voices', host: 'Alem T.', slug: 'diaspora-voices', category: 'Culture', coverImage: 'https://picsum.photos/300/300', audioFile: 'sample.mp3', duration: '45:00', status: 'visible', likes: 124, comments: 32, likedBy: [{id: 1, name: 'User 1', avatar: 'https://i.pravatar.cc/150?u=1', date: '2h ago'}], commentList: [{id: 1, name: 'User 2', avatar: 'https://i.pravatar.cc/150?u=2', text: 'Great episode!', date: '1d ago'}] },
  { id: 2, title: 'Tech in Africa', host: 'Samuel B.', slug: 'tech-africa', category: 'Tech', coverImage: 'https://picsum.photos/300/301', audioFile: 'sample2.mp3', duration: '30:00', status: 'hidden', likes: 85, comments: 12 },
  { id: 3, title: 'Investing Home', host: 'Liya K.', slug: 'investing-home', category: 'Business', coverImage: 'https://picsum.photos/300/302', audioFile: 'sample3.mp3', duration: '50:00', status: 'visible', likes: 210, comments: 56 }
];

export const MOCK_VIDEOS: Video[] = [
  { id: 1, title: 'Grand Ethiopian Renaissance Dam Update', slug: 'gerd-update', description: 'Latest news on GERD.', videoFile: 'video.mp4', category: 'News', thumbnail: 'https://picsum.photos/400/225', duration: '10:24', views: 1200, likes: 340, comments: 45, status: 'visible', uploadDate: '2025-05-12' },
  { id: 2, title: 'Cultural Festival 2024 Highlights', slug: 'festival-2024', description: 'Best moments from the annual festival.', videoFile: 'video2.mp4', category: 'Events', thumbnail: 'https://picsum.photos/400/226', duration: '05:15', views: 890, likes: 120, comments: 10, status: 'visible', uploadDate: '2025-06-01' },
  { id: 3, title: 'Interview with CEO of EthioTelecom', slug: 'interview-ethio', description: 'Exclusive interview.', videoFile: 'video3.mp4', category: 'Interviews', thumbnail: 'https://picsum.photos/400/227', duration: '45:00', views: 5000, likes: 900, comments: 120, status: 'hidden', uploadDate: '2025-04-20' }
];

export const MOCK_ARTICLES: Article[] = [
  { id: 1, title: 'The Rise of Tech Startups in Addis', slug: 'tech-startups-addis', image: 'https://picsum.photos/600/400', excerpt: 'Exploring the booming tech scene.', content: 'Full content goes here...', category: 'Business', author: 'Dawit M.', publishDate: '2025-10-01', status: 'published', views: 1500, likes: 200, comments: 30 },
  { id: 2, title: 'Top 10 Tourist Destinations', slug: 'top-10-destinations', image: 'https://picsum.photos/600/401', excerpt: 'Where to visit next summer.', content: 'Full content...', category: 'Culture', author: 'Sara L.', publishDate: '2025-09-15', status: 'draft', views: 0, likes: 0, comments: 0 },
  { id: 3, title: 'Coffee Export Trends 2025', slug: 'coffee-trends-2025', image: 'https://picsum.photos/600/402', excerpt: 'Analysis of the coffee market.', content: 'Full content...', category: 'Business', author: 'Abebe K.', publishDate: '2025-10-05', status: 'published', views: 3200, likes: 450, comments: 80 }
];

export const MOCK_SUBSCRIBERS: Subscriber[] = [
  { id: 1, email: 'john.doe@example.com', name: 'John Doe', joinedDate: '2025-01-15', status: 'active', source: 'Website', plan: 'Free' },
  { id: 2, email: 'jane.smith@example.com', name: 'Jane Smith', joinedDate: '2025-02-20', status: 'active', source: 'Social Media', plan: 'Premium' },
  { id: 3, email: 'alex.b@example.com', name: 'Alex Brown', joinedDate: '2025-03-10', status: 'bounced', source: 'Referral', plan: 'Free' },
  { id: 4, email: 'sarah.j@example.com', name: 'Sarah Jenkins', joinedDate: '2025-04-05', status: 'unsubscribed', source: 'Website', plan: 'Free' },
  { id: 5, email: 'mike.t@example.com', name: 'Mike Tyson', joinedDate: '2025-05-01', status: 'active', source: 'Social Media', plan: 'Premium' }
];

export const MOCK_NEWSLETTERS: Newsletter[] = [
  { id: 1, subject: 'Weekly Digest: Top News', sentDate: '2025-10-01', recipientCount: 5200, openRate: '45%', clickRate: '12%', status: 'Sent', segment: 'All Subscribers', image: 'https://picsum.photos/600/200', content: 'Here is the weekly update...' },
  { id: 2, subject: 'Exclusive Premium Offer', sentDate: '2025-10-10', recipientCount: 1500, openRate: '60%', clickRate: '25%', status: 'Scheduled', segment: 'Premium', content: 'Special offer for you...' },
  { id: 3, subject: 'Community Highlights', sentDate: '-', recipientCount: 0, openRate: '-', clickRate: '-', status: 'Draft', segment: 'All Subscribers', content: 'Draft content...' }
];

export const MOCK_EVENTS: Event[] = [
  { 
    id: 1, 
    title: 'Global Diaspora Conference 2025', 
    date: '2025-11-15', 
    time: '09:00 AM', 
    location: 'Millennium Hall, Addis Ababa', 
    attendees: 1200, 
    image: 'https://picsum.photos/600/400', 
    description: 'Annual gathering of the diaspora community.', 
    status: 'visible',
    price: '$50.00',
    organizer: 'Habesha Expat Team',
    attendeeList: [
        { id: 1, name: 'Abebe Bikila', email: 'abebe@example.com', avatar: 'https://i.pravatar.cc/150?u=10', ticketType: 'VIP', purchaseDate: '2025-10-01', status: 'Confirmed' },
        { id: 2, name: 'Derartu Tulu', email: 'derartu@example.com', avatar: 'https://i.pravatar.cc/150?u=11', ticketType: 'Standard', purchaseDate: '2025-10-05', status: 'Confirmed' }
    ]
  },
  { 
    id: 2, 
    title: 'Tech Summit & Expo', 
    date: '2025-12-01', 
    time: '10:00 AM', 
    location: 'Sheraton Addis', 
    attendees: 500, 
    image: 'https://picsum.photos/600/401', 
    description: 'Showcasing the latest in tech.', 
    status: 'visible',
    price: 'Free',
    organizer: 'Tech Association'
  },
  { 
    id: 3, 
    title: 'Cultural Art Exhibition', 
    date: '2025-10-20', 
    time: '02:00 PM', 
    location: 'National Museum', 
    attendees: 300, 
    image: 'https://picsum.photos/600/402', 
    description: 'Displaying contemporary art.', 
    status: 'hidden',
    price: '$10.00',
    organizer: 'Art Collective'
  }
];

export const MOCK_ADS: Ad[] = [
  { id: 1, title: 'Summer Sale Banner', type: 'Image', placement: 'Homepage Hero', url: 'https://shop.com/sale', durationDays: 7, mediaFile: 'banner.jpg', status: 'active' },
  { id: 2, title: 'Tech Conference Promo', type: 'Video', placement: 'Sidebar', url: 'https://techconf.com', durationDays: 14, mediaFile: 'promo.mp4', status: 'active' },
  { id: 3, title: 'App Launch', type: 'Image', placement: 'Footer', url: 'https://app.com', durationDays: 30, mediaFile: 'footer.jpg', status: 'inactive' }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Technology', type: 'Article' },
  { id: 2, name: 'Business', type: 'Business' },
  { id: 3, name: 'Culture', type: 'Podcast' },
  { id: 4, name: 'News', type: 'Video' },
  { id: 5, name: 'Events', type: 'Article' }
];

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@habeshaexpat.com', role: 'Admin', status: 'Active', location: 'New York, USA' },
  { id: 2, name: 'Editor One', email: 'editor@habeshaexpat.com', role: 'Editor', status: 'Active', location: 'London, UK' },
  { id: 3, name: 'Member User', email: 'member@gmail.com', role: 'Member', status: 'Banned', location: 'Addis Ababa, ET' },
  { id: 4, name: 'Premium User', email: 'premium@yahoo.com', role: 'Premium', status: 'Active', location: 'Dubai, UAE' }
];

export const MOCK_JOBS: Job[] = [
    { 
      id: 1, 
      title: 'Senior Frontend Developer', 
      company: 'TechGlobal Solutions', 
      location: 'Remote (US/EU)', 
      type: 'Full-time', 
      salary: '$80k - $120k', 
      industry: 'Technology', 
      description: 'We are looking for an experienced React developer to join our global team.', 
      responsibilities: ['Build reusable components', 'Optimize performance', 'Collaborate with design team'], 
      requirements: ['5+ years React', 'TypeScript mastery', 'Experience with Tailwind'], 
      benefits: ['Remote work', 'Health insurance', 'Annual retreat'], 
      postedDate: '2025-10-20', 
      status: 'visible' 
    },
    { 
      id: 2, 
      title: 'Marketing Manager', 
      company: 'Abyssinia Coffee Co.', 
      location: 'Addis Ababa, ET', 
      type: 'Full-time', 
      salary: 'Competitive', 
      industry: 'Food & Beverage', 
      description: 'Lead our marketing initiatives and brand growth.', 
      responsibilities: ['Social media strategy', 'Brand partnerships', 'Event management'], 
      requirements: ['3+ years marketing exp', 'Bilingual (Amharic/English)', 'Creative mindset'], 
      benefits: ['Free coffee', 'Transport allowance'], 
      postedDate: '2025-10-18', 
      status: 'visible' 
    }
  ];
  
  export const MOCK_APPLICANTS: JobApplicant[] = [
    { 
      id: 1, 
      jobId: 1, 
      name: 'Elias Tekle', 
      email: 'elias.tekle@gmail.com', 
      phone: '+1 555 0123', 
      linkedin: 'linkedin.com/in/eliastekle', 
      resumeUrl: 'resume.pdf', 
      coverLetter: 'I am excited to apply for this position...', 
      appliedDate: '2025-10-21', 
      status: 'Pending', 
      avatar: 'https://i.pravatar.cc/150?u=30' 
    },
    { 
      id: 2, 
      jobId: 1, 
      name: 'Sarah Jones', 
      email: 'sarah.j@outlook.com', 
      phone: '+44 7700 900000', 
      linkedin: 'linkedin.com/in/sarahjones', 
      resumeUrl: 'cv.pdf', 
      appliedDate: '2025-10-22', 
      status: 'Reviewed', 
      avatar: 'https://i.pravatar.cc/150?u=31' 
    }
  ];

export const MOCK_SYSTEM_STATUS: SystemStatus[] = [
    { id: 1, serviceName: 'Public Website', status: 'activated', maintenanceMessage: 'We are currently performing scheduled maintenance. We will be back shortly.', updatedBy: 'Admin User', updatedAt: '2025-10-24 10:00 AM' },
    { id: 2, serviceName: 'Admin Panel', status: 'activated', maintenanceMessage: 'Admin access is temporarily restricted for security updates.', updatedBy: 'Admin User', updatedAt: '2025-10-24 10:00 AM' }
];
