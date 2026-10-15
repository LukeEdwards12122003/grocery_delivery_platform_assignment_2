
const assert = require('assert');
const { getOrderState } = require('../states/orderStates');

describe('GDP-45 Order State pattern', () => {
    it('permits editing and cancellation only when Pending', () => {
        for (const status of ['Draft', 'Pending', 'Preparing', 'Completed', 'Cancelled']) {
            assert.strictEqual(getOrderState(status).canEdit(), status === 'Pending');
            assert.strictEqual(getOrderState(status).canCancel(), status === 'Pending');
        }
    });

    it('allows only defined status transitions', () => {
        const allowed = {
            Draft: ['Pending'],
            Pending: ['Preparing', 'Cancelled'],
            Preparing: ['Completed'],
            Completed: [],
            Cancelled: [],
        };
        for (const [status, permitted] of Object.entries(allowed)) {
            for (const next of Object.keys(allowed)) {
                assert.strictEqual(getOrderState(status).canTransitionTo(next), permitted.includes(next), `${status} -> ${next}`);
            }
        }
    });

    it('rejects unrecognised statuses', () => {
        assert.throws(() => getOrderState('Unknown'), /Unknown order status/);
    });
});
