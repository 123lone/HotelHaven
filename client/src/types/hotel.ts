export interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discount?: string;
  roomType: string;
  category: string;
  amenities: string[];
  isFavorite: boolean;
  isPopular?: boolean;
  isSoldOut?: boolean;
  badge?: {
    text: string;
    color: 'green' | 'red' | 'blue' | 'orange' | 'yellow';
  };
}

export interface SearchParams {
  location: string;
  checkin: string;
  checkout: string;
  guests: string;
}

export interface FilterState {
  priceRange: number;
  starRating: number[];
  roomTypes: string[];
  amenities: string[];
}
