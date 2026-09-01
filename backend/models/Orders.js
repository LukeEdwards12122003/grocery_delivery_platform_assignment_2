const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Preparing', 'Completed'], default: 'Pending' },
});

module.exports = mongoose.model('Order', orderSchema);