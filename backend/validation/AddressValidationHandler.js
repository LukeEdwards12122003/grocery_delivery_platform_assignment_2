const ValidationHandler = require('./ValidationHandler')

class AddressValidationHandler extends ValidationHandler {
  check(order) {
    if (!order.deliveryMethod) {
      return null
    }

    // Delivery orders require street address, suburb and postcode
    if (!order.streetAddress || !order.suburb || !order.postcode) {
      return 'Street address, suburb and postcode are required'
    }

    // Postcode must contain exactly four digits
    if (!/^\d{4}$/.test(String(order.postcode))) {
      return 'Postcode must contain exactly four digits'
    }

    return null
  }
}

module.exports = AddressValidationHandler
