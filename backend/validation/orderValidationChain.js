const QuantityValidationHandler = require('./QuantityValidationHandler')
const AddressValidationHandler = require('./AddressValidationHandler')
const DeliveryAreaValidationHandler = require('./DeliveryAreaValidationHandler')
const DeliveryMethodValidationHandler = require('./DeliveryMethodValidationHandler')

const createOrderValidationChain = (includeDeliveryMethod = false) => {
  const quantityHandler = new QuantityValidationHandler()
  const addressHandler = new AddressValidationHandler()
  const deliveryAreaHandler = new DeliveryAreaValidationHandler()
  const deliveryMethodHandler = new DeliveryMethodValidationHandler()

  quantityHandler.setNext(addressHandler)

  if (includeDeliveryMethod) {
    addressHandler.setNext(deliveryMethodHandler)
    deliveryMethodHandler.setNext(deliveryAreaHandler)
  } else {
    addressHandler.setNext(deliveryAreaHandler)
  }

  return quantityHandler
}

module.exports = createOrderValidationChain
