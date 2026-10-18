const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginUser } = require('../controllers/authController');

const mockResponse = () => ({
  status: sinon.stub().returnsThis(),
  json: sinon.spy(),
});

describe('Authentication - Login Tests', () => {
  let originalJwtSecret;

  before(() => {
    originalJwtSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-only-jwt-secret-do-not-use-in-production';
  });

  after(() => {
    if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalJwtSecret;
  });

  afterEach(() => sinon.restore());

  it('logs in a customer with valid credentials and returns a JWT', async () => {
    const user = {
      id: '507f1f77bcf86cd799439011',
      name: 'Customer One',
      email: 'customer@example.com',
      password: 'hashed-password',
      role: 'customer',
    };
    sinon.stub(User, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compare').resolves(true);
    const req = { body: { email: user.email, password: 'correct-password' } };
    const res = mockResponse();

    await loginUser(req, res);

    expect(User.findOne.calledOnceWithExactly({ email: user.email })).to.be.true;
    expect(bcrypt.compare.calledOnceWithExactly('correct-password', user.password)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    const result = res.json.firstCall.args[0];
    expect(result).to.include({ id: user.id, email: user.email, role: 'customer' });
    expect(result).not.to.have.property('password');
    expect(jwt.verify(result.token, process.env.JWT_SECRET).id).to.equal(user.id);
  });

  it('logs in a staff member with the staff role', async () => {
    const user = {
      id: '507f1f77bcf86cd799439012',
      name: 'Staff One',
      email: 'staff@example.com',
      password: 'hashed-password',
      role: 'staff',
    };
    sinon.stub(User, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compare').resolves(true);
    const res = mockResponse();

    await loginUser({ body: { email: user.email, password: 'correct' } }, res);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0].role).to.equal('staff');
    expect(res.json.firstCall.args[0].token).to.be.a('string');
  });

  it('rejects an incorrect password with 401', async () => {
    sinon.stub(User, 'findOne').resolves({ password: 'hashed-password' });
    sinon.stub(bcrypt, 'compare').resolves(false);
    const res = mockResponse();

    await loginUser({ body: { email: 'user@example.com', password: 'wrong' } }, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Invalid email or password' })).to.be.true;
  });

  it('rejects an unknown email with 401', async () => {
    sinon.stub(User, 'findOne').resolves(null);
    const compareStub = sinon.stub(bcrypt, 'compare');
    const res = mockResponse();

    await loginUser({ body: { email: 'missing@example.com', password: 'any' } }, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Invalid email or password' })).to.be.true;
    expect(compareStub.notCalled).to.be.true;
  });

  it('returns 500 when the database lookup fails', async () => {
    sinon.stub(User, 'findOne').rejects(new Error('Database unavailable'));
    const res = mockResponse();

    await loginUser({ body: { email: 'user@example.com', password: 'any' } }, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Database unavailable' })).to.be.true;
  });
});
