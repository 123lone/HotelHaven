const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  const { hotelId } = req.body;

  // Check if hotel exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: 'Hotel not found'
    });
  }

  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: { room }
  });
};

// @desc    Get rooms with filters
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  const {
    hotelId,
    roomType,
    priceMin,
    priceMax,
    amenities,
    maxGuests,
    isAvailable,
    page = 1,
    limit = 10,
    sortBy = 'pricePerNight',
    sortOrder = 'asc'
  } = req.query;

  // Build query
  const query = {};

  if (hotelId) {
    query.hotelId = hotelId;
  }

  if (roomType) {
    query.roomType = roomType;
  }

  if (priceMin || priceMax) {
    query.pricePerNight = {};
    if (priceMin) query.pricePerNight.$gte = parseInt(priceMin);
    if (priceMax) query.pricePerNight.$lte = parseInt(priceMax);
  }

  if (amenities) {
    const amenityArray = amenities.split(',');
    query.amenities = { $in: amenityArray };
  }

  if (maxGuests) {
    query.maxGuests = { $gte: parseInt(maxGuests) };
  }

  if (isAvailable !== undefined) {
    query.isAvailable = isAvailable === 'true';
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Execute query
  const rooms = await Room.find(query)
    .populate('hotelId', 'name location starRating')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const totalRooms = await Room.countDocuments(query);
  const totalPages = Math.ceil(totalRooms / limit);

  res.status(200).json({
    success: true,
    data: {
      rooms,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRooms,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate('hotelId', 'name location starRating address contact');

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { room }
  });
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('hotelId', 'name location');

  res.status(200).json({
    success: true,
    message: 'Room updated successfully',
    data: { room: updatedRoom }
  });
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  await Room.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Room deleted successfully'
  });
};

// @desc    Check room availability
// @route   POST /api/rooms/:id/availability
// @access  Public
const checkAvailability = async (req, res) => {
  const { startDate, endDate } = req.body;
  const roomId = req.params.id;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Start date and end date are required'
    });
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Room not found'
    });
  }

  // Check if room is generally available
  if (!room.isAvailable) {
    return res.status(200).json({
      success: true,
      data: { available: false, reason: 'Room is currently unavailable' }
    });
  }

  // Check for conflicting bookings
  const Booking = require('../models/Booking');
  const conflictingBooking = await Booking.findOne({
    roomId,
    status: { $in: ['confirmed', 'checked-in'] },
    $or: [
      {
        startDate: { $lte: new Date(startDate) },
        endDate: { $gt: new Date(startDate) }
      },
      {
        startDate: { $lt: new Date(endDate) },
        endDate: { $gte: new Date(endDate) }
      },
      {
        startDate: { $gte: new Date(startDate) },
        endDate: { $lte: new Date(endDate) }
      }
    ]
  });

  const available = !conflictingBooking;

  res.status(200).json({
    success: true,
    data: {
      available,
      reason: available ? 'Room is available for the selected dates' : 'Room is already booked for the selected dates'
    }
  });
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  checkAvailability
};