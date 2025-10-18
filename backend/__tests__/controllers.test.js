const orderController = require('../controllers/orderController');
const Order = require('../model/order');
const userController = require('../controllers/userController');
const agentController = require('../controllers/agentController');

jest.mock('../model/order');
jest.mock('../model/user');

describe('Order Controller unit tests', () => {
  afterEach(() => jest.clearAllMocks());

  test('listOrders sends orders', async () => {
    const fake = [{ orderId: '1' }];
    // Order.find().sort(...) in controller
    Order.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fake) });
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await orderController.listOrders(req, res);
    expect(Order.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fake);
  });

  test('updateOrderStatus returns 404 when not found', async () => {
    Order.findByIdAndUpdate.mockResolvedValue(null);
    const req = { params: { id: 'no' }, body: { status: 'paid' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await orderController.updateOrderStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('User & Agent controllers', () => {
  afterEach(() => jest.clearAllMocks());

  test('listUsers returns json', async () => {
    const fake = [{ name: 'u' }];
    const User = require('../model/user');
    // User.find().select(...) chain
    User.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(fake) });
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await userController.listUsers(req, res);
    expect(res.json).toHaveBeenCalledWith(fake);
  });

  test('listAgents returns delivery users', async () => {
    const fake = [{ name: 'agent' }];
    const User = require('../model/user');
    // User.find({ role: 'delivery' }).select(...)
    User.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(fake) });
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await agentController.listAgents(req, res);
    expect(res.json).toHaveBeenCalledWith(fake);
  });
});
