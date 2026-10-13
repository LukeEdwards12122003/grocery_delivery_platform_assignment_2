const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
  streetAddress: {
    type: String,
    trim: true,
  },
  suburb: {
    type: String,
    trim: true,
  },
  postcode: {
    type: String,
    match: /^\d{4}$/,
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Preparing', 'Completed'],
    default: 'Draft',
  },
  deliveryMethod: {
    type: String,
    enum: ['standard', 'express'],
  }
});

module.exports = mongoose.model('Order', orderSchema);