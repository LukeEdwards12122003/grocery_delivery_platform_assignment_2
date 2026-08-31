const Order = require('../models/Orders');

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
    const { item, quantity, deliveryAddress } = req.body;
    try {
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: 'Only customers can place orders' });
        }
        if (!item || !quantity || !deliveryAddress || Number(quantity) <= 0) {
            return res.status(400).json({ message: 'Please provide valid order details' });
        }
        const order = await Order.create({
            customerId: req.user.id,
            item,
            quantity,
            deliveryAddress,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder };