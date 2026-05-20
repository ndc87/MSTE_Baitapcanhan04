const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

/**
 * ── ADDRESS MANAGEMENT ──
 */
router.post('/addresses', protect, userController.addAddress);
router.put('/addresses/:addressId', protect, userController.updateAddress);
router.delete('/addresses/:addressId', protect, userController.removeAddress);

/**
 * ── WISHLIST MANAGEMENT ──
 */
router.get('/wishlist', protect, userController.getWishlist);
router.post('/wishlist/:productId', protect, userController.toggleWishlist);

module.exports = router;
