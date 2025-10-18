import React from 'react';
import { render, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import * as api from '../mockApi';

jest.mock('../mockApi');

describe('CartContext.placeOrder', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('creates order and marks paid when options.paid is true', async () => {
    const fakeCreated = { _id: 'mongo-id', orderId: 'ORD-1', status: 'pending' };
    api.createOrderApi.mockResolvedValue(fakeCreated);
    api.updateOrderStatusApi.mockResolvedValue({ ...fakeCreated, status: 'paid' });

    const ctx = {};
    const TestComp = () => {
      Object.assign(ctx, useCart());
      return null;
    };

    render(<CartProvider><TestComp /></CartProvider>);

    // add an item to cart
    act(() => { ctx.addToCart({ id: 1, name: 'Ginger', price: 10 }); });

    let summary;
    await act(async () => { summary = await ctx.placeOrder({ address: 'A', payment: 'online' }, { paid: true }); });

    expect(api.createOrderApi).toHaveBeenCalled();
    expect(api.updateOrderStatusApi).toHaveBeenCalledWith('mongo-id', 'paid');
    expect(summary.status).toBe('paid');
  });

  test('falls back to localStorage when createOrderApi throws', async () => {
    api.createOrderApi.mockRejectedValue(new Error('Network')); 
  const ctx2 = {};
  const TestComp2 = () => { Object.assign(ctx2, useCart()); return null; };
  render(<CartProvider><TestComp2 /></CartProvider>);

  act(() => { ctx2.addToCart({ id: 2, name: 'Garlic', price: 20 }); });
  let summary2;
  await act(async () => { summary2 = await ctx2.placeOrder({ address: 'B', payment: 'COD' }, { paid: false }); });

  expect(api.createOrderApi).toHaveBeenCalled();
  expect(summary2.status).toBe('pending');
  const stored = JSON.parse(localStorage.getItem('admin_orders') || '[]');
  expect(stored.length).toBeGreaterThan(0);
  });
});
