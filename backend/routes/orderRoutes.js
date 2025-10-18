const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', auth, requireRole('admin', 'delivery'), ctrl.listOrders);
router.post('/', ctrl.createOrder);
router.patch('/:id/status', auth, requireRole('admin', 'delivery'), ctrl.updateOrderStatus);
router.patch('/:id/assign', auth, requireRole('admin'), ctrl.assignOrder);

module.exports = router;


