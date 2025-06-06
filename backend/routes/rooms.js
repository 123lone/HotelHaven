const express = require('express');
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  checkAvailability
} = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const { validateRequest, roomSchema } = require('../middlewares/validateRequest');

const router = express.Router();

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private/Admin
router.post('/', authMiddleware, isAdmin, validateRequest(roomSchema), createRoom);

// @route   GET /api/rooms
// @desc    Get rooms with filters
// @access  Public
router.get('/', getRooms);

// @route   GET /api/rooms/:id
// @desc    Get single room by ID
// @access  Public
router.get('/:id', getRoomById);

// @route   POST /api/rooms/:id/availability
// @desc    Check room availability
// @access  Public
router.post('/:id/availability', checkAvailability);

// @route   PUT /api/rooms/:id
// @desc    Update room
// @access  Private/Admin
router.put('/:id', authMiddleware, isAdmin, updateRoom);

// @route   DELETE /api/rooms/:id
// @desc    Delete room
// @access  Private/Admin
router.delete('/:id', authMiddleware, isAdmin, deleteRoom);

module.exports = router;