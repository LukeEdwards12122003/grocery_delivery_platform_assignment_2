class ValidationHandler {
  constructor(nextHandler = null) {
    this.nextHandler = nextHandler
  }

  // to connect handlers
  setNext(handler) {
    this.nextHandler = handler
    return handler
  }

  // to run the chain
  handle(order) {
    const errorMessage = this.check(order)

    if (errorMessage) {
      return {
        valid: false,
        message: errorMessage,
      }
    }

    if (this.nextHandler) {
      return this.nextHandler.handle(order)
    }

    return {
      valid: true,
    }
  }

  // for each subclass to override
  check(order) {
    return null
  }
}

module.exports = ValidationHandler
