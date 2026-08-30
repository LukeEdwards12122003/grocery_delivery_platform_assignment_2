const express = require('express');
const { addOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, addOrder);

module.exports = router;