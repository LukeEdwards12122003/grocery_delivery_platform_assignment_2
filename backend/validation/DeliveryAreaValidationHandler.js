const ValidationHandler = require('./ValidationHandler')

class DeliveryAreaValidationHandler extends ValidationHandler {
  check(order) {
    // Supported postcode validation will go here
    return null
  }
}

module.exports = DeliveryAreaValidationHandler
