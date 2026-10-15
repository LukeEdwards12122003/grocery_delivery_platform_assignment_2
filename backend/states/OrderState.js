
class OrderState {
    constructor(name) {
        this.name = name;
    }

    canEdit() {
        return false;
    }

    canCancel() {
        return false;
    }

    canTransitionTo(nextStatus) {
        return false;
    }
}

module.exports = OrderState;
