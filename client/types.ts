

export interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Business {
  id: number;
  name: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  mapPin: string;
  image: string;
  website: string;
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
  reviews?: Review[];
}

export interface Like {
  id: number;
  name: string;
  avatar: string;
  date: string;
}

export interface Comment {
  id: number;
  name: string;
  avatar: string;
  text: string;
  date: string;
}

export interface Podcast {
  id: number;
  title: string;
  host: string;
  slug: string;
  category: string;
  coverImage: string;
  audioFile: string;
  duration: string;
  likes?: number;
  comments?: number;
  status?: 'visible' | 'hidden';
  likedBy?: Like[];
  commentList?: Comment[];
}

export interface Video {
  id: number;
  title: string;
  slug: string;
  description: string;
  videoFile: string;
  category: string;
  thumbnail: string;
  duration?: string;
  views?: number;
  likes?: number;
  comments?: number;
  status?: 'visible' | 'hidden';
  uploadDate?: string;
  likedBy?: Like[];
  commentList?: Comment[];
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published';
  likes?: number;
  comments?: number;
  views?: number;
  likedBy?: Like[];
  commentList?: Comment[];
}

export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  joinedDate: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source?: 'Website' | 'Referral' | 'Social Media';
  plan?: 'Free' | 'Premium';
  avatar?: string;
}

export interface Newsletter {
  id: number;
  subject: string;
  sentDate: string;
  recipientCount: number;
  openRate: string;
  clickRate: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  segment: string;
  image?: string;
  content?: string;
}

export interface Attendee {
  id: number;
  name: string;
  email: string;
  avatar: string;
  ticketType: 'Standard' | 'VIP' | 'Early Bird';
  purchaseDate: string;
  status: 'Confirmed' | 'Check-in';
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time?: string;
  location: string;
  attendees: number;
  image: string;
  description: string;
  status?: 'visible' | 'hidden';
  price?: string;
  organizer?: string;
  attendeeList?: Attendee[];
}

export interface Ad {
  id: number;
  title: string;
  type: 'Image' | 'Video';
  placement: string;
  url: string;
  durationDays: number;
  mediaFile: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: number;
  name: string;
  type: 'Article' | 'Podcast' | 'Video' | 'Business';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'Author' | 'Member' | 'Premium' | 'Editor';
  status: 'Active' | 'Banned';
  location?: string;
  joinedDate?: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  industry: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  status: 'visible' | 'hidden';
}

export interface JobApplicant {
  id: number;
  jobId: number;
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  resumeUrl: string;
  coverLetter?: string;
  appliedDate: string;
  status: 'Pending' | 'Reviewed' | 'Rejected' | 'Hired';
  avatar?: string;
}

export interface SystemStatus {
  id: number;
  serviceName: string;
  status: 'activated' | 'deactivated';
  maintenanceMessage: string;
  updatedBy: string;
  updatedAt: string;
}