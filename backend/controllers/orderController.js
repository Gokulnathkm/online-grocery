const Order = require('../model/order');

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { orderId, customerName, customerEmail, total, items } = req.body;
    const o = new Order({ orderId, customerName, customerEmail, total, items, status: 'pending' });
    await o.save();
    res.status(201).json(o);
  } catch (err) {
    res.status(400).json({ msg: 'Invalid data' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Mongo _id
    const { status } = req.body;
    const o = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!o) return res.status(404).json({ msg: 'Not found' });
    res.json(o);
  } catch (err) {
    res.status(400).json({ msg: 'Invalid data' });
  }
};

exports.assignOrder = async (req, res) => {
  try {
    const { id } = req.params; // Mongo _id
    const { assignedTo } = req.body; // email
    const o = await Order.findById(id);
    if (!o) return res.status(404).json({ msg: 'Not found' });
    o.assignedTo = assignedTo || null;
    if (o.status === 'paid' && assignedTo) o.status = 'shipped';
    await o.save();
    res.json(o);
  } catch (err) {
    res.status(400).json({ msg: 'Invalid data' });
  }
};




