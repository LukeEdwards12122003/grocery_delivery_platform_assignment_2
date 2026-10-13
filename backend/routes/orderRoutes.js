const express = require('express');
const { getOrders, addOrder, updateOrderStatus, updateDeliveryMethod } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getOrders).post(protect, addOrder);
router.route('/:id/status').put(protect, updateOrderStatus);
router.route('/delivery-method').patch(protect, updateDeliveryMethod);

module.exports = router;