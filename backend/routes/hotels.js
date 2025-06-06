const express = require('express');
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  searchHotels
} = require('../controllers/hotelController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const { validateRequest, hotelSchema } = require('../middlewares/validateRequest');

const router = express.Router();

// @route   POST /api/hotels
// @desc    Create a new hotel
// @access  Private/Admin
router.post('/', authMiddleware, isAdmin, validateRequest(hotelSchema), createHotel);

// @route   GET /api/hotels
// @desc    Get all hotels with filters
// @access  Public
router.get('/', getHotels);

// @route   GET /api/hotels/search/:query
// @desc    Search hotels by text
// @access  Public
router.get('/search/:query', searchHotels);

// @route   GET /api/hotels/:id
// @desc    Get single hotel by ID
// @access  Public
router.get('/:id', getHotelById);

// @route   PUT /api/hotels/:id
// @desc    Update hotel
// @access  Private/Admin
router.put('/:id', authMiddleware, isAdmin, updateHotel);

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel
// @access  Private/Admin
router.delete('/:id', authMiddleware, isAdmin, deleteHotel);

module.exports = router;