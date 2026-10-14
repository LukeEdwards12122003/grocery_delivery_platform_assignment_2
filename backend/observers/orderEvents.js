
const OrderSubject = require('./OrderSubject');
const CustomerNotificationObserver = require('./CustomerNotificationObserver');
const StaffNotificationObserver = require('./StaffNotificationObserver');

// Create one shared subject
const orderEvents = new OrderSubject();

// Register the observers
orderEvents.attach(new CustomerNotificationObserver());
orderEvents.attach(new StaffNotificationObserver());

module.exports = orderEvents;
