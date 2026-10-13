const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
  streetAddress: {
    type: String,
    required: true,
  },
  suburb: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
    match: /^\d{4}$/,
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Completed'],
    default: 'Pending',
  },
  deliveryMethod: {
    type: String,
    enum: ['standard', 'express'],
  }
});

module.exports = mongoose.model('Order', orderSchema);