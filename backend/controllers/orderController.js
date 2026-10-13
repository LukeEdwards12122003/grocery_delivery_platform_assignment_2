const Order = require('../models/Orders');
const orderEvents = require('../observers/orderEvents');
const createOrderValidationChain = require('../validation/orderValidationChain')

const getOrders = async (req, res) => {
    try {
        let orders;

      // Leave the customer query unchanged so customers can still see their draft orders in checkout.
        if (req.user.role === 'staff') {
        orders = await Order.find({ status: { $ne: 'Draft' } }).populate(
          'customerId',
          'name email',
        )
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
  const { item, quantity } = req.body
    try {
        if (req.user.role !== 'customer') {
      return res
        .status(403)
        .json({ message: 'Only customers can place orders' })
    }

    if (!item) {
      return res.status(400).json({
        message: 'Please provide a valid item',
      })
    }

    const validationChain = createOrderValidationChain()
    const validationResult = validationChain.handle({
      item,
      quantity,
    })
    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message })
        }
        
const order = await Order.create({
    customerId: req.user.id,
    item,
    quantity: Number(quantity),
  status: 'Draft',
})

// await orderEvents.notify({
//     type: 'ORDER_PLACED',
//     orderId: order._id,
//     customerId: order.customerId
// });

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

      // Draft orders have not completed checkout and validation, so staff cannot process them.
      if (order.status === 'Draft') {
        return res.status(400).json({
          message: 'Complete checkout before processing this order',
        })
      }

      const previousStatus = order.status

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

const updateDeliveryMethod = async (req, res) => {
    const { orderIds, deliveryMethod, streetAddress, suburb, postcode } =
      req.body

    try {
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: 'Only customers can update delivery method' });
        }

        if (!['standard', 'express'].includes(deliveryMethod)) {
            return res.status(400).json({ message: 'Invalid delivery method' });
        }

        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ message: 'Order IDs must be a non-empty array' });
        }

        const orders = await Order.find({  customerId: req.user.id , _id: { $in: orderIds } });
        if (orders.length !== orderIds.length) {
        return res.status(404).json({ message: 'One or more orders not found' })
      }

      // Allow checkout drafts and pending orders to be updated. Later statuses are locked.
      if (
        orders.some((order) => !['Draft', 'Pending'].includes(order.status))
      ) {
        return res.status(400).json({
          message: 'Only draft or pending orders can be updated',
        })
      }

      const validationChain = createOrderValidationChain()
      const updates = []

      // Validate every selected order before saving any, so one invalid order blocks the whole update.
      for (const order of orders) {
        const address = {
          streetAddress: String(streetAddress ?? '').trim(),
          suburb: String(suburb ?? '').trim(),
          postcode: String(postcode ?? '').trim(),
        }

        const result = validationChain.handle({
          item: order.item,
          quantity: order.quantity,
          deliveryMethod,
          streetAddress: address.streetAddress,
          suburb: address.suburb,
          postcode: address.postcode,
        })

        if (!result.valid) {
          return res.status(400).json({ message: result.message })
        }

        updates.push({ order, address, isDraft: order.status === 'Draft' })
      }

      // Save the orders after they pass the checks.
      const updatedOrders = await Promise.all(
        updates.map(async ({ order, address }) => {
          order.deliveryMethod = deliveryMethod
          order.streetAddress = address.streetAddress
          order.suburb = address.suburb
          order.postcode = address.postcode
          order.status = 'Pending'
          return order.save()
        }),
      )

      // Send a notification for new orders after checkout.
      // JERRY created this notification code block. I commented out his original one. I moved here since I needed to change address and delivery option valification for my design feature.
      await Promise.all(
        updates
          .filter(({ isDraft }) => isDraft)
          .map(({ order }) =>
            orderEvents.notify({
              type: 'ORDER_PLACED',
              orderId: order._id,
              customerId: order.customerId,
            }),
          ),
      )

      res.json(updatedOrders)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder, updateOrderStatus, updateDeliveryMethod };