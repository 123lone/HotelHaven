const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { roomId, hotelId, startDate, endDate, numberOfGuests, specialRequests } = req.body;
  const userId = req.user.id;

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start < now) {
    return res.status(400).json({
      success: false,
      message: 'Start date cannot be in the past'
    });
  }

  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: 'End date must be after start date'
    });
  }

  // Check if room exists and is available
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  if (!room.isAvailable) {
    return res.status(400).json({
      success: false,
      message: 'Room is not available'
    });
  }

  // Check guest capacity
  if (numberOfGuests > room.maxGuests) {
    return res.status(400).json({
      success: false,
      message: `Room can accommodate maximum ${room.maxGuests} guests`
    });
  }

  // Check for conflicting bookings
  const conflictingBooking = await Booking.findOne({
    roomId,
    status: { $in: ['confirmed', 'checked-in'] },
    $or: [
      {
        startDate: { $lte: start },
        endDate: { $gt: start }
      },
      {
        startDate: { $lt: end },
        endDate: { $gte: end }
      },
      {
        startDate: { $gte: start },
        endDate: { $lte: end }
      }
    ]
  });

  if (conflictingBooking) {
    return res.status(400).json({
      success: false,
      message: 'Room is already booked for the selected dates'
    });
  }

  // Calculate total price
  const timeDiff = end.getTime() - start.getTime();
  const totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const totalPrice = totalNights * room.pricePerNight;

  // Create booking
  const booking = await Booking.create({
    userId,
    roomId,
    hotelId,
    startDate: start,
    endDate: end,
    numberOfGuests,
    totalPrice,
    specialRequests
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('userId', 'name email')
    .populate('roomId', 'roomNumber roomType pricePerNight')
    .populate('hotelId', 'name location');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: { booking: populatedBooking }
  });
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  // Build query
  const query = { userId };
  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const bookings = await Booking.find(query)
    .populate('roomId', 'roomNumber roomType pricePerNight maxGuests amenities')
    .populate('hotelId', 'name location starRating contact')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalBookings = await Booking.countDocuments(query);
  const totalPages = Math.ceil(totalBookings / limit);

  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  const { status, hotelId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  // Build query
  const query = {};
  if (status) query.status = status;
  if (hotelId) query.hotelId = hotelId;

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Execute query
  const bookings = await Booking.find(query)
    .populate('userId', 'name email')
    .populate('roomId', 'roomNumber roomType pricePerNight')
    .populate('hotelId', 'name location')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const totalBookings = await Booking.countDocuments(query);
  const totalPages = Math.ceil(totalBookings / limit);

  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('roomId', 'roomNumber roomType pricePerNight maxGuests amenities images')
    .populate('hotelId', 'name location starRating address contact amenities');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check if user owns this booking or is admin
  if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.status(200).json({
    success: true,
    data: { booking }
  });
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check if user owns this booking or is admin
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled'
    });
  }

  if (booking.status === 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel completed booking'
    });
  }

  // Check if booking is in the past
  if (booking.startDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel booking that has already started'
    });
  }

  booking.status = 'cancelled';
  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate('userId', 'name email')
    .populate('roomId', 'roomNumber roomType')
    .populate('hotelId', 'name location');

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: { booking: updatedBooking }
  });
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  if (!['confirmed', 'cancelled', 'completed', 'checked-in'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  booking.status = status;
  if (status === 'checked-in') {
    booking.checkInTime = new Date();
  }
  if (status === 'completed') {
    booking.checkOutTime = new Date();
  }

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate('userId', 'name email')
    .populate('roomId', 'roomNumber roomType')
    .populate('hotelId', 'name location');

  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    data: { booking: updatedBooking }
  });
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus
};