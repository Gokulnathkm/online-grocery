const User = require('../model/user');

exports.listAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'delivery' }).select('name email');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};




