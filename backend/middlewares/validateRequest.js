const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: errorMessage
      });
    }
    
    next();
  };
};

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const hotelSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).required(),
  location: Joi.string().required(),
  starRating: Joi.number().min(1).max(5).required(),
  images: Joi.array().items(Joi.string().uri()),
  amenities: Joi.array().items(Joi.string().valid('WiFi', 'Pool', 'AC', 'Parking', 'Gym', 'Restaurant', 'Spa', 'Bar', 'Pet Friendly', 'Room Service')),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zipCode: Joi.string()
  }),
  contact: Joi.object({
    phone: Joi.string(),
    email: Joi.string().email(),
    website: Joi.string().uri()
  })
});

const roomSchema = Joi.object({
  hotelId: Joi.string().required(),
  roomNumber: Joi.string().required(),
  roomType: Joi.string().valid('Single Room', 'Double Room', 'Deluxe Suite', 'Presidential Suite', 'Family Room', 'Executive Suite').required(),
  pricePerNight: Joi.number().min(0).required(),
  maxGuests: Joi.number().min(1).required(),
  amenities: Joi.array().items(Joi.string().valid('WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Sea View', 'Mountain View', 'Jacuzzi', 'Kitchen', 'Workspace')),
  size: Joi.number().min(100),
  bedType: Joi.string().valid('Single', 'Double', 'Queen', 'King', 'Twin Beds').required(),
  images: Joi.array().items(Joi.string().uri()),
  floor: Joi.number().min(1),
  description: Joi.string().max(500)
});

const bookingSchema = Joi.object({
  roomId: Joi.string().required(),
  hotelId: Joi.string().required(),
  startDate: Joi.date().min('now').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  numberOfGuests: Joi.number().min(1).required(),
  specialRequests: Joi.string().max(500)
});

module.exports = {
  validateRequest,
  registerSchema,
  loginSchema,
  hotelSchema,
  roomSchema,
  bookingSchema
};