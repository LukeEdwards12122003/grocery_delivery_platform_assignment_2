
const Notification = require('../models/Notification');

class CustomerNotificationObserver {

    async update(event) {

        // Only handle order status changes
        if (event.type !== 'ORDER_STATUS_CHANGED') {
            return;
        }

        await Notification.create({
            recipientId: event.customerId,
            orderId: event.orderId,
            eventType: event.type,
            message: `Your order ${event.orderId} status has changed to ${event.status}.`
        });

    }
}

module.exports = CustomerNotificationObserver;
