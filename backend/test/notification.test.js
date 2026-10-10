
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { expect } = chai;

const Order = require('../models/Orders');
const Notification = require('../models/Notification');
const orderEvents = require('../observers/orderEvents');

const {
    addOrder,
    updateOrderStatus
} = require('../controllers/orderController');

const {
    getNotifications,
    markNotificationAsRead
} = require('../controllers/notificationController');

// Create a mock Express response
const mockResponse = () => ({
    status: sinon.stub().returnsThis(),
    json: sinon.spy()
});

describe('Notifications - Observer Pattern Tests', () => {

    // Restore all mocked functions after each test
    afterEach(() => {
        sinon.restore();
    });

    it('should publish ORDER_PLACED when a customer places an order', async () => {
        const customerId = new mongoose.Types.ObjectId().toString();
        const orderId = new mongoose.Types.ObjectId().toString();

        const req = {
            user: { id: customerId, role: 'customer' },
            body: {
                item: 'Milk',
                quantity: 2,
                deliveryAddress: '123 Test Street'
            }
        };

        const order = {
            _id: orderId,
            customerId,
            ...req.body,
            status: 'Pending'
        };

        sinon.stub(Order, 'create').resolves(order);
        const notifyStub = sinon.stub(orderEvents, 'notify').resolves();

        const res = mockResponse();

        await addOrder(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(notifyStub.calledOnce).to.be.true;

        expect(notifyStub.firstCall.args[0].type)
            .to.equal('ORDER_PLACED');

        expect(notifyStub.firstCall.args[0].orderId)
            .to.equal(orderId);
    });

    it('should reject invalid orders without publishing an event', async () => {
        const req = {
            user: {
                id: new mongoose.Types.ObjectId().toString(),
                role: 'customer'
            },
            body: {
                item: '',
                quantity: 0,
                deliveryAddress: ''
            }
        };

        const createStub = sinon.stub(Order, 'create');
        const notifyStub = sinon.stub(orderEvents, 'notify');

        const res = mockResponse();

        await addOrder(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(createStub.called).to.be.false;
        expect(notifyStub.called).to.be.false;
    });

    it('should publish ORDER_STATUS_CHANGED when staff updates a status', async () => {
        const orderId = new mongoose.Types.ObjectId().toString();
        const customerId = new mongoose.Types.ObjectId().toString();

        const order = {
            _id: orderId,
            customerId,
            status: 'Pending'
        };

        order.save = sinon.stub().resolves(order);

        sinon.stub(Order, 'findById').resolves(order);
        const notifyStub = sinon.stub(orderEvents, 'notify').resolves();

        const req = {
            user: { role: 'staff' },
            params: { id: orderId },
            body: { status: 'Preparing' }
        };

        const res = mockResponse();

        await updateOrderStatus(req, res);

        expect(order.status).to.equal('Preparing');
        expect(res.json.calledOnce).to.be.true;
        expect(notifyStub.calledOnce).to.be.true;

        expect(notifyStub.firstCall.args[0].type)
            .to.equal('ORDER_STATUS_CHANGED');

        expect(notifyStub.firstCall.args[0].status)
            .to.equal('Preparing');
    });

    it('should not publish an event if the status is unchanged', async () => {
        const order = {
            _id: new mongoose.Types.ObjectId().toString(),
            customerId: new mongoose.Types.ObjectId().toString(),
            status: 'Preparing'
        };

        order.save = sinon.stub().resolves(order);

        sinon.stub(Order, 'findById').resolves(order);
        const notifyStub = sinon.stub(orderEvents, 'notify').resolves();

        const req = {
            user: { role: 'staff' },
            params: { id: order._id },
            body: { status: 'Preparing' }
        };

        const res = mockResponse();

        await updateOrderStatus(req, res);

        expect(res.json.calledOnce).to.be.true;
        expect(notifyStub.called).to.be.false;
    });

    it('should retrieve notifications only for the logged-in user', async () => {
        const userId = new mongoose.Types.ObjectId().toString();

        const notifications = [{
            _id: new mongoose.Types.ObjectId().toString(),
            recipientId: userId,
            message: 'Your order status has changed.',
            isRead: false
        }];

        const sortStub = sinon.stub().resolves(notifications);
        const findStub = sinon.stub(Notification, 'find')
            .returns({ sort: sortStub });

        const req = { user: { id: userId } };
        const res = mockResponse();

        await getNotifications(req, res);

        expect(findStub.calledOnceWith({ recipientId: userId }))
            .to.be.true;

        expect(sortStub.calledWith({ createdAt: -1 }))
            .to.be.true;

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(notifications)).to.be.true;
    });

    it('should mark the logged-in user notification as read', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const notificationId = new mongoose.Types.ObjectId().toString();

        const notification = {
            _id: notificationId,
            recipientId: userId,
            isRead: true
        };

        const updateStub = sinon.stub(
            Notification, 'findOneAndUpdate'
        ).resolves(notification);

        const req = {
            user: { id: userId },
            params: { id: notificationId }
        };

        const res = mockResponse();

        await markNotificationAsRead(req, res);

        expect(updateStub.calledOnce).to.be.true;

        expect(updateStub.firstCall.args[0]).to.deep.equal({
            _id: notificationId,
            recipientId: userId
        });

        expect(updateStub.firstCall.args[1]).to.deep.equal({
            isRead: true
        });

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0].notification.isRead)
            .to.be.true;
    });

    it('should return 404 when the notification does not belong to the user', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const notificationId = new mongoose.Types.ObjectId().toString();

        sinon.stub(Notification, 'findOneAndUpdate')
            .resolves(null);

        const req = {
            user: { id: userId },
            params: { id: notificationId }
        };

        const res = mockResponse();

        await markNotificationAsRead(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWithMatch({
            message: 'Notification not found'
        })).to.be.true;
    });

    it('should reject an invalid notification ID', async () => {
        const updateStub = sinon.stub(
            Notification, 'findOneAndUpdate'
        );

        const req = {
            user: { id: new mongoose.Types.ObjectId().toString() },
            params: { id: 'invalid-id' }
        };

        const res = mockResponse();

        await markNotificationAsRead(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(updateStub.called).to.be.false;
    });

});
