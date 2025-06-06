# Hotel Booking Backend API

A comprehensive Node.js/Express backend API for a hotel booking application with JWT authentication, MongoDB database, and full CRUD operations.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password hashing with bcrypt
  - Protected routes

- **Hotel Management**
  - Create, read, update, delete hotels
  - Search and filter hotels by location, name, star rating
  - Image upload support
  - Admin-only hotel management

- **Room Management**
  - Room creation and management
  - Price and availability filtering
  - Room amenities and capacity
  - Availability checking

- **Booking System**
  - Create and manage bookings
  - Booking status tracking
  - Date validation and conflict checking
  - User and admin booking views

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configurations:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/hotel_booking
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hotels
- `POST /api/hotels` - Create hotel (Admin)
- `GET /api/hotels` - Get all hotels with filters
- `GET /api/hotels/:id` - Get hotel by ID
- `PUT /api/hotels/:id` - Update hotel (Admin)
- `DELETE /api/hotels/:id` - Delete hotel (Admin)
- `GET /api/hotels/search/:query` - Search hotels

### Rooms
- `POST /api/rooms` - Create room (Admin)
- `GET /api/rooms` - Get rooms with filters
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room (Admin)
- `DELETE /api/rooms/:id` - Delete room (Admin)
- `POST /api/rooms/:id/availability` - Check availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (Admin)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

## Request/Response Examples

### Register User
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### Create Hotel (Admin)
```javascript
POST /api/hotels
Headers: { "Authorization": "Bearer jwt_token" }
{
  "name": "Grand Hotel",
  "description": "Luxury hotel in downtown",
  "location": "New York, NY",
  "starRating": 5,
  "amenities": ["WiFi", "Pool", "Gym"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
```

### Search Hotels
```javascript
GET /api/hotels?location=new york&starRating=4&page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "hotels": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalHotels": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Create Booking
```javascript
POST /api/bookings
Headers: { "Authorization": "Bearer jwt_token" }
{
  "roomId": "room_id",
  "hotelId": "hotel_id",
  "startDate": "2024-07-01",
  "endDate": "2024-07-05",
  "numberOfGuests": 2,
  "specialRequests": "Late check-in please"
}
```

## Database Models

### User
- name, email, password (hashed)
- role (user/admin)
- isActive, lastLogin, timestamps

### Hotel
- name, description, location, starRating
- images, amenities, address, contact
- createdBy (admin), isActive, timestamps

### Room
- hotelId, roomNumber, roomType, pricePerNight
- maxGuests, amenities, size, bedType
- images, isAvailable, floor, description

### Booking
- userId, roomId, hotelId
- startDate, endDate, totalPrice, numberOfGuests
- status, paymentStatus, specialRequests
- checkInTime, checkOutTime, totalNights

## Security Features

- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- JWT token expiration
- Password hashing with bcrypt
- Input validation with Joi
- MongoDB injection protection

## Error Handling

Comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- Not found errors
- Server errors

## Technologies Used

- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Joi for validation
- Helmet for security
- CORS for cross-origin requests
- Express Rate Limit