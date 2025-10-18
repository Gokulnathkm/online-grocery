const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
    items: { type: [orderItemSchema], default: [] },
    assignedTo: { type: String, default: null } // delivery agent email
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);




