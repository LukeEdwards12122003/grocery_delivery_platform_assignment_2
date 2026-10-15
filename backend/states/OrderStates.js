
const OrderState = require('./OrderState');

class DraftState extends OrderState {
    constructor() { super('Draft'); }
    // Checkout uses its existing Draft -> Pending flow.
    canTransitionTo(nextStatus) { return nextStatus === 'Pending'; }
}

class PendingState extends OrderState {
    constructor() { super('Pending'); }
    canEdit() { return true; }
    canCancel() { return true; }
    canTransitionTo(nextStatus) {
        return nextStatus === 'Preparing' || nextStatus === 'Cancelled';
    }
}

class PreparingState extends OrderState {
    constructor() { super('Preparing'); }
    canTransitionTo(nextStatus) { return nextStatus === 'Completed'; }
}

class CompletedState extends OrderState {
    constructor() { super('Completed'); }
}

class CancelledState extends OrderState {
    constructor() { super('Cancelled'); }
}

const states = {
    Draft: new DraftState(),
    Pending: new PendingState(),
    Preparing: new PreparingState(),
    Completed: new CompletedState(),
    Cancelled: new CancelledState(),
};

const getOrderState = (status) => {
    const state = states[status];
    if (!state) throw new Error(`Unknown order status: ${status}`);
    return state;
};

module.exports = { getOrderState, DraftState, PendingState, PreparingState, CompletedState, CancelledState };
