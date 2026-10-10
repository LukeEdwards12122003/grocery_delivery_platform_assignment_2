
const Notification = require('../models/Notification');
const User = require('../models/User');

class StaffNotificationObserver {

    async update(event) {

        const eventMessages = {
            ORDER_PLACED: 'placed',
            ORDER_EDITED: 'edited',
            ORDER_CANCELLED: 'cancelled'
        };

        const action = eventMessages[event.type];

        // Ignore events not intended for staff
        if (!action) {
            return;
        }

        // Find all staff accounts
        const staffMembers = await User.find({
            role: 'staff'
        }).select('_id');

        if (staffMembers.length === 0) {
            return;
        }

        // Create a notification for each staff member
        const notifications = staffMembers.map((staff) => ({
            recipientId: staff._id,
            orderId: event.orderId,
            eventType: event.type,
            message: `Order ${event.orderId} has been ${action}.`
        }));

        await Notification.insertMany(notifications);
    }
}

module.exports = StaffNotificationObserver;
