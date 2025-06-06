const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  roomId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  hotelId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Number of guests must be at least 1']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'checked-in'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  totalNights: {
    type: Number
  }
}, {
  timestamps: true
});

// Calculate total nights before saving
bookingSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    this.totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  next();
});

// Index for search optimization
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ roomId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ hotelId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);