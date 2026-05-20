const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:itemId', cartController.updateCartItem);
router.delete('/remove/:itemId', cartController.removeCartItem);

module.exports = router;
