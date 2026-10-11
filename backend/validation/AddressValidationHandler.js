const ValidationHandler = require('./ValidationHandler')

class AddressValidationHandler extends ValidationHandler {
  check(order) {
    // Address validation will go here
    return null
  }
}

module.exports = AddressValidationHandler
