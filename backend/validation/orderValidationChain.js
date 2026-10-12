const QuantityValidationHandler = require('./QuantityValidationHandler')
const AddressValidationHandler = require('./AddressValidationHandler')
const DeliveryAreaValidationHandler = require('./DeliveryAreaValidationHandler')

const createOrderValidationChain = () => {
  const quantityHandler = new QuantityValidationHandler()
  const addressHandler = new AddressValidationHandler()
  const deliveryAreaHandler = new DeliveryAreaValidationHandler()

  quantityHandler.setNext(addressHandler).setNext(deliveryAreaHandler)

  return quantityHandler
}

module.exports = createOrderValidationChain
