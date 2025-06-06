import { useState } from 'react';
import { FilterState } from '@/types/hotel';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState(filters.priceRange);

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
    onFiltersChange({ ...filters, priceRange: value });
  };

  const handleStarRatingChange = (rating: number, checked: boolean) => {
    const newRatings = checked 
      ? [...filters.starRating, rating]
      : filters.starRating.filter(r => r !== rating);
    onFiltersChange({ ...filters, starRating: newRatings });
  };

  const handleRoomTypeChange = (roomType: string, checked: boolean) => {
    const newRoomTypes = checked
      ? [...filters.roomTypes, roomType]
      : filters.roomTypes.filter(rt => rt !== roomType);
    onFiltersChange({ ...filters, roomTypes: newRoomTypes });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: 250,
      starRating: [],
      roomTypes: [],
      amenities: []
    });
    setPriceRange(250);
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0" role="complementary" aria-label="Hotel filters">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            <i className="fas fa-filter mr-2"></i>Filters
          </h2>
          <button 
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Price Range (per night)</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">$0</span>
              <span className="text-gray-600 dark:text-gray-400">$500+</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="500" 
              value={priceRange} 
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex items-center justify-between text-sm font-medium">
              <span>$0</span>
              <span className="text-primary">${priceRange}</span>
              <span>$500+</span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Star Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3].map(rating => (
              <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  checked={filters.starRating.includes(rating)}
                  onChange={(e) => handleStarRatingChange(rating, e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-3 flex items-center">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className={`${i < rating ? 'fas' : 'far'} fa-star text-xs`}></i>
                    ))}
                  </div>
                  <span className="ml-2 text-sm">{rating}+ Stars</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Room Type</h3>
          <div className="space-y-2">
            {['Single Room', 'Double Room', 'Deluxe Suite', 'Presidential Suite'].map(roomType => (
              <label key={roomType} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  checked={filters.roomTypes.includes(roomType)}
                  onChange={(e) => handleRoomTypeChange(roomType, e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-3 text-sm">{roomType}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Amenities</h3>
          <div className="space-y-2">
            {[
              { name: 'Free WiFi', icon: 'fas fa-wifi' },
              { name: 'Swimming Pool', icon: 'fas fa-swimming-pool' },
              { name: 'Air Conditioning', icon: 'fas fa-snowflake' },
              { name: 'Fitness Center', icon: 'fas fa-dumbbell' },
              { name: 'Free Parking', icon: 'fas fa-car' },
              { name: 'Restaurant', icon: 'fas fa-utensils' },
              { name: 'Pet Friendly', icon: 'fas fa-paw' }
            ].map(amenity => (
              <label key={amenity.name} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                <input 
                  type="checkbox" 
                  checked={filters.amenities.includes(amenity.name)}
                  onChange={(e) => handleAmenityChange(amenity.name, e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-3 text-sm flex items-center">
                  <i className={`${amenity.icon} mr-2 text-gray-500 w-4`}></i>
                  {amenity.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
