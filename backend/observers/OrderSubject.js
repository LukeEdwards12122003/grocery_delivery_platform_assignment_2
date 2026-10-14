
class OrderSubject {
    constructor() {
        this.observers = new Set();
    }

    // Register an observer
    attach(observer) {
        if (!observer || typeof observer.update !== 'function') {
            throw new Error('Observer must have an update method');
        }

        this.observers.add(observer);
    }

    // Remove an observer
    detach(observer) {
        this.observers.delete(observer);
    }

    // Notify observers when an order event occurs
    async notify(event) {
        const results = await Promise.allSettled(
            [...this.observers].map((observer) =>
                Promise.resolve().then(() => observer.update(event))
            )
        );

        results.forEach((result) => {
            if (result.status === 'rejected') {
                console.error(
                    'Notification observer failed:',
                    result.reason
                );
            }
        });

        return results;
    }
}

module.exports = OrderSubject;
