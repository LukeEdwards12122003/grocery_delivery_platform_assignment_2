const express = require('express');
const { getOrders, addOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getOrders).post(protect, addOrder);

module.exports = router;