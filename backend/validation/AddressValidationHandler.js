const ValidationHandler = require('./ValidationHandler')

class AddressValidationHandler extends ValidationHandler {
  check(order) {
    // Pickup orders do not require delivery address details
    // NEED TO CHNAGE order.deliveryMethod AFTER THE EPIC 2 IS DONE
    if (order.deliveryMethod === 'pickup') {
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
