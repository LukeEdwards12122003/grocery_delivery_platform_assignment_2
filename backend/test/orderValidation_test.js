const { expect } = require('chai')
const createOrderValidationChain = require('../validation/orderValidationChain')

describe('Order validation chain', () => {
  it('accepts a valid delivery order', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 2,
      deliveryMethod: 'delivery',
      streetAddress: '123 Test Street',
      suburb: 'Brisbane City',
      postcode: '4000',
    })

    expect(result.valid).to.equal(true)
  })

  it('rejects a quantity above 10', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 11,
      deliveryMethod: 'delivery',
      streetAddress: '123 Test Street',
      suburb: 'Brisbane City',
      postcode: '4000',
    })

    expect(result.valid).to.equal(false)
    expect(result.message).to.equal('The maximum quantity is 10')
  })

  it('stops at the first failed validation', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 11,
      deliveryMethod: 'delivery',
    })

    expect(result.valid).to.equal(false)
    expect(result.message).to.equal('The maximum quantity is 10')
  })

  it('allows pickup orders without delivery address details', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 2,
      deliveryMethod: 'pickup',
    })

    expect(result.valid).to.equal(true)
  })
})
