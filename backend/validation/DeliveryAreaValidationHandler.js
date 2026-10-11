const ValidationHandler = require('./ValidationHandler')

// NEED TO COME BACK HERE LATER
const SUPPORTED_POSTCODES = new Set([
  '4000', // Brisbane City
  '4005', // New Farm
  '4006', // Fortitude Valley
  '4101', // West End
  '4170', // Morningside
  '4171', // Bulimba
  '4172', // Carina
])

class DeliveryAreaValidationHandler extends ValidationHandler {
  check(order) {
    // Pickup orders do not require delivery-area validation
    // NEED TO CHNAGE order.deliveryMethod AFTER THE EPIC 2 IS DONE
    if (order.deliveryMethod === 'pickup') {
      return null
    }

    const postcode = String(order.postcode)
    // if the input postcode does not match with supported postcode
    if (!SUPPORTED_POSTCODES.has(postcode)) {
      return 'Delivery is not available in this area'
    }

    return null
  }
}

module.exports = DeliveryAreaValidationHandler
