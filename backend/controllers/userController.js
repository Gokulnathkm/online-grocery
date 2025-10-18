const User = require('../model/user');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};




