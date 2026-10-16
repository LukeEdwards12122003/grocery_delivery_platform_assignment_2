const { expect } = require('chai')
const createOrderValidationChain = require('../validation/orderValidationChain')

describe('Order validation chain', () => {
  it('accepts a valid delivery order', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 2,
      deliveryMethod: 'standard',
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
      deliveryMethod: 'standard',
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
      deliveryMethod: 'standard',
    })

    expect(result.valid).to.equal(false)
    expect(result.message).to.equal('The maximum quantity is 10')
  })

  it('rejects a postcode outside the supported range', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 2,
      deliveryMethod: 'standard',
      streetAddress: '123 Test Street',
      suburb: 'Brisbane City',
      postcode: '9999',
    })

    expect(result.valid).to.equal(false)
    expect(result.message).to.equal('Delivery is not available in this area')
  })

  it('checks the address before the delivery area', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 2,
      deliveryMethod: 'standard',
      streetAddress: '',
      suburb: 'Brisbane City',
      postcode: '9999',
    })

    expect(result.valid).to.equal(false)
    expect(result.message).to.equal(
      'Street address, suburb and postcode are required',
    )
  })

  it('checks postcode format before the delivery area', () => {
    const chain = createOrderValidationChain()

    const result = chain.handle({
      item: 'Milk',
      quantity: 2,
      deliveryMethod: 'standard',
      streetAddress: '123 Test Street',
      suburb: 'Brisbane City',
      postcode: '40A0',
    })

    expect(result.valid).to.equal(false)
    expect(result.message).to.equal(
      'Postcode must contain exactly four digits',
    )
  })
})

describe('Order validation chain with delivery method', () => {
  it('accepts a valid delivery order', () => {
    const chain = createOrderValidationChain(true)

    const result = chain.handle({
      "item": "Milk",
      "quantity": 2,
      "deliveryMethod": "standard",
      "streetAddress": "123 Test Street",
      "suburb": "Brisbane City",
      "postcode": "4000"
    }
    )

    expect(result.valid).to.equal(true)
  })

  it('rejects an invalid delivery method', () => {
    const chain = createOrderValidationChain(true)

    const result = chain.handle({
      "item": "Milk",
      "quantity": 2,
      "deliveryMethod": "pickup",
      "streetAddress": "123 Test Street",
      "suburb": "Brisbane City",
      "postcode": "4000"
    }
    )
    expect(result.valid).to.equal(false)
    expect(result.message).to.equal('Invalid delivery method')
  })

  it('rejects a missing delivery method', () => {
    const chain = createOrderValidationChain(true)

    const result = chain.handle({
      "item": "Milk",
      "quantity": 2,
      "deliveryMethod": "",
      "streetAddress": "123 Test Street",
      "suburb": "Brisbane City",
      "postcode": "4000"
    }
    )
    expect(result.valid).to.equal(false)
    expect(result.message).to.equal('Delivery method is required')
  })
})