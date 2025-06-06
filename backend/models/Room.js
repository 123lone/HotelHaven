const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required']
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['Single Room', 'Double Room', 'Deluxe Suite', 'Presidential Suite', 'Family Room', 'Executive Suite']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'Maximum guests must be at least 1']
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Sea View', 'Mountain View', 'Jacuzzi', 'Kitchen', 'Workspace']
  }],
  size: {
    type: Number, // in square feet
    min: [100, 'Room size must be at least 100 sq ft']
  },
  bedType: {
    type: String,
    enum: ['Single', 'Double', 'Queen', 'King', 'Twin Beds'],
    required: true
  },
  images: [{
    type: String,
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url);
      },
      message: 'Please provide valid image URLs'
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  floor: {
    type: Number,
    min: [1, 'Floor must be at least 1']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index for hotel and room number uniqueness
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

// Index for search optimization
roomSchema.index({ roomType: 1, pricePerNight: 1 });
roomSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Room', roomSchema);