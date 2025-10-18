require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204,
  preflightContinue: false
}));
app.use(express.json()); // Parse JSON bodies

// Simple request logger
app.use((req, res, next) => {
  try {
    const origin = req.headers.origin || null;
    const referer = req.headers.referer || null;
    console.log(`[REQ] ${req.method} ${req.originalUrl} origin=${origin} referer=${referer}`);
  } catch {}
  next();
});

// Test route
app.get('/', (req, res) => res.send('API is running...'));

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));
// Product & Order routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health endpoint for DB status
app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const conn = mongoose.connection;
  const info = {
    dbState: state,
    dbName: conn?.name || null,
    host: conn?.host || null
  };
  res.json({ ok: true, ...info });
});

// Catch-all for undefined routes (Express v5 compatible)
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

module.exports = app;
