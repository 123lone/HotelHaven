import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSearch } from '@/components/hero-search';
import { FilterSidebar } from '@/components/filter-sidebar';
import { HotelListings } from '@/components/hotel-listings';
import { Pagination } from '@/components/pagination';
import { Footer } from '@/components/footer';
import { LoginModal } from '@/components/login-modal';
import { SearchParams, FilterState, Hotel } from '@/types/hotel';

// Sample hotel data
const sampleHotels: Hotel[] = [
  {
    id: '1',
    name: 'Oceanview Paradise Resort',
    location: 'Malibu, California',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    rating: 5,
    price: 189,
    originalPrice: 252,
    roomType: 'Scenic View',
    category: 'Deluxe Room',
    amenities: ['WiFi', 'Pool', 'AC', 'Parking'],
    isFavorite: false,
    badge: { text: '25% OFF', color: 'green' }
  },
  {
    id: '2',
    name: 'Metropolitan Grand Hotel',
    location: 'Downtown NYC',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    rating: 4,
    price: 299,
    roomType: 'Business Center',
    category: 'Executive Suite',
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Service'],
    isFavorite: false
  },
  {
    id: '3',
    name: 'Alpine Mountain Lodge',
    location: 'Aspen, Colorado',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    rating: 5,
    price: 359,
    roomType: 'Mountain View',
    category: 'Suite',
    amenities: ['WiFi', 'Fireplace', 'Ski', 'Spa'],
    isFavorite: true,
    isPopular: true,
    badge: { text: 'POPULAR', color: 'orange' }
  },
  {
    id: '4',
    name: 'Tropical Beach Resort',
    location: 'Maui, Hawaii',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    rating: 4,
    price: 449,
    roomType: 'Ocean View',
    category: 'All-Inclusive',
    amenities: ['WiFi', 'Pool', 'Bar', 'Beach'],
    isFavorite: false,
    badge: { text: 'BEACHFRONT', color: 'blue' }
  },
  {
    id: '5',
    name: 'Boutique Garden Inn',
    location: 'Brooklyn Heights, New York',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    rating: 4,
    price: 129,
    roomType: 'Standard Room',
    category: 'Pet Friendly',
    amenities: ['WiFi', 'Pet Friendly', 'Restaurant', 'Parking'],
    isFavorite: false
  },
  {
    id: '6',
    name: 'Modern City Tower',
    location: 'Midtown East, New York',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    rating: 5,
    price: 299,
    roomType: 'Executive Suite',
    category: 'Business Center',
    amenities: ['WiFi', 'Gym', 'AC', 'Restaurant'],
    isFavorite: false,
    isSoldOut: true,
    badge: { text: 'SOLD OUT', color: 'red' }
  },
  {
    id: '7',
    name: 'Vintage Charm B&B',
    location: 'Greenwich Village, New York',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    rating: 4,
    price: 95,
    roomType: 'Classic Room',
    category: 'Historic',
    amenities: ['WiFi', 'Restaurant', 'Pet Friendly'],
    isFavorite: false,
    badge: { text: 'LAST ROOM', color: 'yellow' }
  }
];

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>(sampleHotels);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Price: Low to High');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 500,
    starRating: [],
    roomTypes: [],
    amenities: []
  });

  const hotelsPerPage = 6;
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const handleSearch = (searchParams: SearchParams) => {
    console.log('Search params:', searchParams);
    // In a real app, this would trigger an API call
  };

  const handleViewDetails = (hotelId: string) => {
    console.log('View details for hotel:', hotelId);
    // In a real app, this would navigate to hotel details page
  };

  const handleBookNow = (hotelId: string) => {
    console.log('Book hotel:', hotelId);
    // In a real app, this would open booking modal or navigate to booking page
  };

  const handleToggleFavorite = (hotelId: string) => {
    setHotels(prev => prev.map(hotel => 
      hotel.id === hotelId 
        ? { ...hotel, isFavorite: !hotel.isFavorite }
        : hotel
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onSignupClick={() => setIsLoginModalOpen(true)}
      />
      
      <HeroSearch onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar 
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          <HotelListings
            hotels={hotels}
            filters={filters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onViewDetails={handleViewDetails}
            onBookNow={handleBookNow}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
      
      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
