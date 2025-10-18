const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/agentController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', auth, requireRole('admin'), ctrl.listAgents);

module.exports = router;


