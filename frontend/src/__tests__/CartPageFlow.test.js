import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartPage from '../pages/CartPage';
import { CartProvider, useCart } from '../context/CartContext';
import * as api from '../mockApi';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

jest.mock('../mockApi');

describe('CartPage modal flow and redirect', () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

  test('opens payment modal, pays and redirects to order confirmation', async () => {
    const created = { _id: 'o123', orderId: 'ORD-123', status: 'pending', items: [{ productId: '1', name: 'G', price: 10, quantity: 1 }], total: 10 };
    api.createOrderApi.mockResolvedValue(created);
    api.updateOrderStatusApi.mockResolvedValue({ ...created, status: 'paid' });

    const history = createMemoryHistory();

    // Test helper to add an item into the real CartProvider after mount
    const Adder = () => {
      const ctx = useCart();
      React.useEffect(() => { ctx.addToCart({ id: 1, name: 'G', price: 10 }); }, []);
      return null;
    };

    render(
      <Router history={history}>
        <CartProvider>
          <Adder />
          <CartPage />
        </CartProvider>
      </Router>
    );

    // The cart item should be visible now
    expect(await screen.findByText(/G/)).toBeInTheDocument();

    // Open payment modal
    const proceed = screen.getByText(/Proceed to Payment/);
    fireEvent.click(proceed);

    // Click Pay with Card
    const payBtn = await screen.findByText(/Pay with Card/);
    fireEvent.click(payBtn);

    // Wait for API calls
    await waitFor(() => expect(api.createOrderApi).toHaveBeenCalled());
    await waitFor(() => expect(api.updateOrderStatusApi).toHaveBeenCalled());

    // After payment, should navigate to /order-confirmation
    await waitFor(() => expect(history.location.pathname).toBe('/order-confirmation'));
  });
});
