const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../model/user');

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
  await User.deleteMany({});
});

describe('Auth flows', () => {
  test('Register then login returns token', async () => {
    const user = { name: 'Test', email: 'test@example.com', password: 'pass123', role: 'admin' };
    const reg = await request(app).post('/api/auth/register').send(user).expect(201);
    expect(reg.body.msg).toMatch(/registered/i);

    const login = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password }).expect(200);
    expect(login.body).toHaveProperty('token');
    expect(login.body).toHaveProperty('role', 'admin');
  });

  test('Protected route /api/orders requires auth and role', async () => {
    // create a non-admin user (use valid password to pass validation)
    const u = new User({ name: 'Cust', email: 'cust@example.com', password: 'validpass', role: 'customer' });
    await u.save();
    // login to get token (we rely on matchPassword - override method)
    u.matchPassword = async (p) => true;
    await u.save();

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: u._id, email: u.email, role: u.role, name: u.name }, process.env.JWT_SECRET || 'devsecret');

    // non-admin should get 403 when accessing GET /api/orders
    await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`).expect(403);

    // create an admin user
    const a = new User({ name: 'Admin', email: 'admin@example.com', password: 'validpass', role: 'admin' });
    a.matchPassword = async (p) => true;
    await a.save();
    const adminToken = jwt.sign({ id: a._id, email: a.email, role: a.role, name: a.name }, process.env.JWT_SECRET || 'devsecret');

    // admin should be allowed
    await request(app).get('/api/orders').set('Authorization', `Bearer ${adminToken}`).expect(200);
  });
});
