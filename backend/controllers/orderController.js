
const Order = require('../models/Orders');
const orderEvents = require('../observers/orderEvents');
const QuantityValidationHandler = require('../validation/QuantityValidationHandler')


const getOrders = async (req, res) => {
    try {
        let orders;

        if (req.user.role === 'staff') {
            orders = await Order.find().populate('customerId', 'name email');
        } else if (req.user.role === 'customer') {
            orders = await Order.find({ customerId: req.user.id });
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const addOrder = async (req, res) => {
  const { item, quantity, streetAddress, suburb, postcode } = req.body
    try {
        if (req.user.role !== 'customer') {
      return res
        .status(403)
        .json({ message: 'Only customers can place orders' })
    }

    const quantityHandler = new QuantityValidationHandler()
    const quantityResult = quantityHandler.handle({
      quantity,
    })
    if (!quantityResult.valid) {
      return res.status(400).json({ message: quantityResult.message })
    }

    if (!item || !streetAddress || !suburb || !postcode) {
      return res
        .status(400)
        .json({ message: 'Street address, suburb and postcode are required' })
    }

    if (!/^\d{4}$/.test(String(postcode))) {
      return res.status(400).json({
        message: 'Postcode must contain exactly four digits',
      })
        }
        
const order = await Order.create({
    customerId: req.user.id,
    item,
    quantity: Number(quantity),
    streetAddress,
    suburb,
    postcode,
});

await orderEvents.notify({
    type: 'ORDER_PLACED',
    orderId: order._id,
    customerId: order.customerId
});

res.status(201).json(order);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        if (req.user.role !== 'staff') {
            return res.status(403).json({ message: 'Only store staff can update order status' });
        }

        if (!['Pending', 'Preparing', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const previousStatus = order.status;

        order.status = status;
        const updatedOrder = await order.save();

        if (previousStatus !== updatedOrder.status) {
            await orderEvents.notify({
                type: 'ORDER_STATUS_CHANGED',
                orderId: updatedOrder._id,
                customerId: updatedOrder.customerId,
                status: updatedOrder.status
            });
        }


        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder, updateOrderStatus };