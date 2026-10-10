const Order = require('../models/Orders');
const orderEvents = require('../observers/orderEvents');

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