const ValidationHandler = require('./ValidationHandler')

class DeliveryMethodValidationHandler extends ValidationHandler {
    check(order) {
        // console.log('Delivery Method Handler executed:', order.deliveryMethod)

        const deliveryMethod = order.deliveryMethod

        if (!deliveryMethod) {
            return 'Delivery method is required'
        }

        if (!['standard', 'express'].includes(deliveryMethod)) {
            return 'Invalid delivery method'
        }

        return null
    }
}

module.exports = DeliveryMethodValidationHandler
