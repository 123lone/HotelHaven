const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
    maxlength: [100, 'Hotel name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Hotel description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Hotel location is required'],
    trim: true
  },
  starRating: {
    type: Number,
    required: [true, 'Star rating is required'],
    min: [1, 'Star rating must be at least 1'],
    max: [5, 'Star rating cannot exceed 5']
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
  amenities: [{
    type: String,
    enum: ['WiFi', 'Pool', 'AC', 'Parking', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Pet Friendly', 'Room Service']
  }],
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for rooms
hotelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hotelId'
});

// Index for search optimization
hotelSchema.index({ location: 'text', name: 'text' });
hotelSchema.index({ starRating: 1 });
hotelSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Hotel', hotelSchema);