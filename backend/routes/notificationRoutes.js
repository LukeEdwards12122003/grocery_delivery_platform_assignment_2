
const express = require('express');

const {
    getNotifications,
    markNotificationAsRead
} = require('../controllers/notificationController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get notifications belonging to the logged-in user
router.get('/', protect, getNotifications);

// Mark a notification as read
router.patch('/:id/read', protect, markNotificationAsRead);

module.exports = router;
