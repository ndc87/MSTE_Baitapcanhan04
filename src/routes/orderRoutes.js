const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/checkout', orderController.checkout);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
