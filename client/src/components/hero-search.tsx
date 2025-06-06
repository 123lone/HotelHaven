import { useState } from 'react';
import { SearchParams } from '@/types/hotel';

interface HeroSearchProps {
  onSearch: (params: SearchParams) => void;
}

export function HeroSearch({ onSearch }: HeroSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    checkin: '',
    checkout: '',
    guests: '1 Adult'
  });

  const handleSearch = () => {
    if (!searchParams.location || !searchParams.checkin || !searchParams.checkout) {
      alert('Please fill in all required fields');
      return;
    }
    onSearch(searchParams);
  };

  const updateSearchParam = (key: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <section className="bg-gradient-to-r from-primary to-orange-500 text-white py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      {/* Beautiful city skyline background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')"}}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-orange-500/80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">Discover amazing hotels, resorts, and stays worldwide at the best prices</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-map-marker-alt text-primary mr-2"></i>Location
                </label>
                <input 
                  type="text" 
                  placeholder="Where are you going?" 
                  value={searchParams.location}
                  onChange={(e) => updateSearchParam('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Check-in Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-calendar-alt text-primary mr-2"></i>Check-in
                </label>
                <input 
                  type="date" 
                  value={searchParams.checkin || today}
                  onChange={(e) => updateSearchParam('checkin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-calendar-alt text-primary mr-2"></i>Check-out
                </label>
                <input 
                  type="date" 
                  value={searchParams.checkout || tomorrow}
                  onChange={(e) => updateSearchParam('checkout', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-users text-primary mr-2"></i>Guests
                </label>
                <select 
                  value={searchParams.guests}
                  onChange={(e) => updateSearchParam('guests', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                >
                  <option value="1 Adult">1 Adult</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                  <option value="3 Adults">3 Adults</option>
                  <option value="4+ Guests">4+ Guests</option>
                </select>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-search mr-2"></i>Search Hotels
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
