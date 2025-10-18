const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', auth, requireRole('admin'), ctrl.listUsers);

module.exports = router;




