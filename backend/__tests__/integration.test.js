const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Order = require('../model/order');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // cleanup
  await Order.deleteMany({});
});

describe('Orders API', () => {
  test('POST /api/orders should create an order with pending status for COD', async () => {
    const payload = {
      orderId: 'TEST-1',
      customerName: 'Tester',
      customerEmail: 't@example.com',
      total: 100,
      items: [{ productId: 'p1', name: 'Garlic', price: 100, quantity: 1 }]
    };

    const res = await request(app).post('/api/orders').send(payload).expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('status', 'pending');

    const db = await Order.findOne({ orderId: 'TEST-1' }).lean();
    expect(db).not.toBeNull();
    expect(db.status).toBe('pending');
  });

  test('PATCH /api/orders/:id/status should update status', async () => {
    const o = new Order({ orderId: 'T2', customerName: 'A', total: 10, items: [] });
    await o.save();
    // create admin user and get token
  const User = require('../model/user');
  const jwt = require('jsonwebtoken');
  const a = new User({ name: 'Admin', email: 'admin2@example.com', password: 'validpass', role: 'admin' });
  await a.save();
  const token = jwt.sign({ id: a._id, email: a.email, role: a.role, name: a.name }, process.env.JWT_SECRET || 'devsecret');
    const res = await request(app).patch(`/api/orders/${o._id}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'paid' }).expect(200);
    expect(res.body).toHaveProperty('status', 'paid');
  });
});
