const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.listProducts);
router.get('/top-selling', productController.getTopSellingProducts);
router.get('/most-viewed', productController.getMostViewedProducts);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
