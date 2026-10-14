
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// GET: View notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipientId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json(notifications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// PATCH: Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({
                message: 'Invalid notification ID'
            });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipientId: req.user.id
            },
            {
                isRead: true
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead
};
