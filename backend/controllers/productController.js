const Product = require('../model/product');

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`[API] Fetched ${products.length} products from database`);
    res.json(products);
  } catch (err) {
    console.error('[API] Error fetching products:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, image, stock, price } = req.body;
    console.log(`[API] Creating product: ${name}`);
    const p = new Product({ name, image, stock, price });
    await p.save();
    console.log(`[API] Product created successfully with ID: ${p._id}`);
    res.status(201).json(p);
  } catch (err) {
    console.error('[API] Error creating product:', err);
    res.status(400).json({ msg: 'Invalid data', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, stock, price } = req.body;
    console.log(`[API] Updating product with ID: ${id}`);
    const p = await Product.findByIdAndUpdate(id, { name, image, stock, price }, { new: true });
    if (!p) {
      console.log(`[API] Product not found with ID: ${id}`);
      return res.status(404).json({ msg: 'Not found' });
    }
    console.log(`[API] Product updated successfully: ${p.name}`);
    res.json(p);
  } catch (err) {
    console.error('[API] Error updating product:', err);
    res.status(400).json({ msg: 'Invalid data', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[API] Deleting product with ID: ${id}`);
    const p = await Product.findByIdAndDelete(id);
    if (!p) {
      console.log(`[API] Product not found with ID: ${id}`);
      return res.status(404).json({ msg: 'Not found' });
    }
    console.log(`[API] Product deleted successfully: ${p.name}`);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('[API] Error deleting product:', err);
    res.status(400).json({ msg: 'Invalid data', error: err.message });
  }
};




