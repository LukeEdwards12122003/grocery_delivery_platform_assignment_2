const express = require('express');
const { getOrders, addOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getOrders).post(protect, addOrder);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;