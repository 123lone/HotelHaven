const Hotel = require('../models/Hotel');

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res) => {
  const hotelData = {
    ...req.body,
    createdBy: req.user.id
  };

  const hotel = await Hotel.create(hotelData);

  res.status(201).json({
    success: true,
    message: 'Hotel created successfully',
    data: { hotel }
  });
};

// @desc    Get all hotels with filters
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  const {
    location,
    name,
    starRating,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { isActive: true };

  if (location) {
    query.$or = [
      { location: { $regex: location, $options: 'i' } },
      { 'address.city': { $regex: location, $options: 'i' } },
      { 'address.state': { $regex: location, $options: 'i' } }
    ];
  }

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (starRating) {
    query.starRating = { $gte: parseInt(starRating) };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Execute query
  const hotels = await Hotel.find(query)
    .populate('createdBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const totalHotels = await Hotel.countDocuments(query);
  const totalPages = Math.ceil(totalHotels / limit);

  res.status(200).json({
    success: true,
    data: {
      hotels,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalHotels,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('rooms');

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: 'Hotel not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { hotel }
  });
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: 'Hotel not found'
    });
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Hotel updated successfully',
    data: { hotel: updatedHotel }
  });
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return res.status(404).json({
      success: false,
      message: 'Hotel not found'
    });
  }

  // Soft delete - set isActive to false
  hotel.isActive = false;
  await hotel.save();

  res.status(200).json({
    success: true,
    message: 'Hotel deleted successfully'
  });
};

// @desc    Search hotels by text
// @route   GET /api/hotels/search/:query
// @access  Public
const searchHotels = async (req, res) => {
  const { query } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const searchQuery = {
    isActive: true,
    $text: { $search: query }
  };

  const skip = (page - 1) * limit;

  const hotels = await Hotel.find(searchQuery)
    .score({ score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(parseInt(limit));

  const totalHotels = await Hotel.countDocuments(searchQuery);

  res.status(200).json({
    success: true,
    data: {
      hotels,
      totalHotels,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalHotels / limit)
    }
  });
};

module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  searchHotels
};