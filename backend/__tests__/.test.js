const ProductController = require('../controllers/productController');
const Product = require('../model/product');

jest.mock('../model/product');

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('listProducts should call res.json with products', async () => {
    const fakeProducts = [{ name: 'A' }, { name: 'B' }];
    // Product.find().sort(...) is used in controller, so mock the chainable call
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeProducts) });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ProductController.listProducts(req, res);
    expect(Product.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fakeProducts);
  });

  test('updateProduct should return 404 when product not found', async () => {
    Product.findByIdAndUpdate.mockResolvedValue(null);
    const req = { params: { id: 'nonexistent' }, body: { name: 'New' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await ProductController.updateProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Not found' }));
  });
});
