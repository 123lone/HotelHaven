const express = require('express');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus
} = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const { validateRequest, bookingSchema } = require('../middlewares/validateRequest');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authMiddleware, validateRequest(bookingSchema), createBooking);

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', authMiddleware, getUserBookings);

// @route   GET /api/bookings/all
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/all', authMiddleware, isAdmin, getAllBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', authMiddleware, getBookingById);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', authMiddleware, cancelBooking);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Admin only)
// @access  Private/Admin
router.put('/:id/status', authMiddleware, isAdmin, updateBookingStatus);

module.exports = router;