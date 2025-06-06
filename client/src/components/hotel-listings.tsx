import { Hotel, FilterState } from '@/types/hotel';
import { HotelCard } from './hotel-card';

interface HotelListingsProps {
  hotels: Hotel[];
  filters: FilterState;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onViewDetails: (hotelId: string) => void;
  onBookNow: (hotelId: string) => void;
  onToggleFavorite: (hotelId: string) => void;
}

export function HotelListings({ 
  hotels, 
  filters, 
  sortBy, 
  onSortChange, 
  onViewDetails, 
  onBookNow, 
  onToggleFavorite 
}: HotelListingsProps) {
  
  // Filter hotels based on current filters
  const filteredHotels = hotels.filter(hotel => {
    // Price filter
    if (hotel.price > filters.priceRange) return false;
    
    // Star rating filter
    if (filters.starRating.length > 0 && !filters.starRating.includes(hotel.rating)) return false;
    
    // Room type filter
    if (filters.roomTypes.length > 0 && !filters.roomTypes.includes(hotel.roomType)) return false;
    
    // Amenities filter
    if (filters.amenities.length > 0) {
      const hotelAmenityNames = hotel.amenities.map(amenity => {
        const amenityMap: { [key: string]: string } = {
          'WiFi': 'Free WiFi',
          'Pool': 'Swimming Pool',
          'AC': 'Air Conditioning',
          'Gym': 'Fitness Center',
          'Parking': 'Free Parking',
          'Restaurant': 'Restaurant',
          'Pet Friendly': 'Pet Friendly'
        };
        return amenityMap[amenity] || amenity;
      });
      
      const hasMatchingAmenity = filters.amenities.some(filterAmenity => 
        hotelAmenityNames.includes(filterAmenity)
      );
      if (!hasMatchingAmenity) return false;
    }
    
    return true;
  });

  // Sort hotels
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Rating: High to Low':
        return b.rating - a.rating;
      case 'Distance':
        return 0; // Would need distance data to implement
      default:
        return 0;
    }
  });

  return (
    <div className="flex-1" role="main" aria-label="Hotel search results">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {filteredHotels.length} Hotels Found
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Rating: High to Low">Rating: High to Low</option>
            <option value="Distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sortedHotels.map(hotel => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onViewDetails={onViewDetails}
            onBookNow={onBookNow}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-search text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hotels found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
}
