const ValidationHandler = require('./ValidationHandler')

class QuantityValidationHandler extends ValidationHandler {
  check(order) {
    const quantity = Number(order.quantity)

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return 'Quantity must be greater than zero'
    }

    if (quantity > 10) {
      return 'The maximum quantity is 10'
    }

    return null
  }
}

module.exports = QuantityValidationHandler
