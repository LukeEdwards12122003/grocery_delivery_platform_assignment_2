const ValidationHandler = require('./ValidationHandler')

class DeliveryAreaValidationHandler extends ValidationHandler {
  check(order) {
    if (!order.deliveryMethod) {
      return null
    }

    const postcode = String(order.postcode)
    const postcodeNumber = Number(postcode)
    // Reject postcodes outside the supported range of 4000–4999.
    if (
      !/^\d{4}$/.test(postcode) ||
      postcodeNumber < 4000 || postcodeNumber > 4999
    ) {
      return 'Delivery is not available in this area'
    }

    return null
  }
}

module.exports = DeliveryAreaValidationHandler
