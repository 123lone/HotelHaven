import { Hotel } from '@/types/hotel';

interface HotelCardProps {
  hotel: Hotel;
  onViewDetails: (hotelId: string) => void;
  onBookNow: (hotelId: string) => void;
  onToggleFavorite: (hotelId: string) => void;
}

export function HotelCard({ hotel, onViewDetails, onBookNow, onToggleFavorite }: HotelCardProps) {
  const getBadgeColor = (color: string) => {
    const colors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const getRoomTypeColor = (roomType: string) => {
    const colors = {
      'Scenic View': 'bg-primary/10 text-primary',
      'Deluxe Room': 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'Business Center': 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-200',
      'Executive Suite': 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'Mountain View': 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200',
      'Suite': 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'Ocean View': 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      'All-Inclusive': 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200',
      'Standard Room': 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200',
      'Pet Friendly': 'bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-200',
      'Classic Room': 'bg-pink-50 text-pink-600 dark:bg-pink-900 dark:text-pink-200',
      'Historic': 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200'
    };
    return colors[roomType as keyof typeof colors] || 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <article className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${hotel.isSoldOut ? 'opacity-75' : ''}`}>
      <div className="relative h-48">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        {hotel.badge && (
          <div className="absolute top-3 left-3">
            <span className={`${getBadgeColor(hotel.badge.color)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
              {hotel.badge.text}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button 
            onClick={() => onToggleFavorite(hotel.id)}
            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-colors"
            aria-label="Add to favorites"
          >
            <i className={`${hotel.isFavorite ? 'fas text-red-500' : 'far'} fa-heart`}></i>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">{hotel.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
              <i className="fas fa-map-marker-alt mr-1"></i>
              {hotel.location}
            </p>
          </div>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => (
              <i key={i} className={`${i < hotel.rating ? 'fas' : 'far'} fa-star text-sm`}></i>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(hotel.roomType)}`}>
            {hotel.roomType}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(hotel.category)}`}>
            {hotel.category}
          </span>
        </div>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          {hotel.amenities.slice(0, 4).map((amenity, index) => {
            const iconMap: { [key: string]: string } = {
              'WiFi': 'fas fa-wifi',
              'Pool': 'fas fa-swimming-pool',
              'AC': 'fas fa-snowflake',
              'Parking': 'fas fa-car',
              'Gym': 'fas fa-dumbbell',
              'Restaurant': 'fas fa-utensils',
              'Service': 'fas fa-concierge-bell',
              'Fireplace': 'fas fa-fire',
              'Ski': 'fas fa-skiing',
              'Spa': 'fas fa-hot-tub',
              'Bar': 'fas fa-cocktail',
              'Beach': 'fas fa-umbrella-beach'
            };
            
            return (
              <span key={index} className="flex items-center" title={amenity}>
                <i className={`${iconMap[amenity] || 'fas fa-check'} mr-1`}></i>
                {amenity}
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">${hotel.price}</span>
            <span className="text-gray-500 text-sm">/night</span>
            {hotel.originalPrice && (
              <div className="text-xs text-gray-500 line-through">${hotel.originalPrice}</div>
            )}
          </div>
          <div className="flex space-x-2">
            {!hotel.isSoldOut ? (
              <>
                <button 
                  onClick={() => onViewDetails(hotel.id)}
                  className="border border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => onBookNow(hotel.id)}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Book Now
                </button>
              </>
            ) : (
              <button className="px-4 py-2 text-gray-400 border border-gray-300 rounded-lg cursor-not-allowed text-sm font-medium" disabled>
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
