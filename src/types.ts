export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  shoeType: string;
  brand?: string;
  size?: string;
  message?: string;
  timestamp: string;
  status: "new" | "contacted" | "completed";
}

export interface ShoeCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  count: string;
  badge?: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  priceTag: string;
  details: string;
  originalPrice?: string;
  offerPrice: string;
  badge: string;
  saving?: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  tag: string;
}

export interface InstagramStory {
  id: string;
  imageUrl: string;
  title: string;
  viewed: boolean;
}
