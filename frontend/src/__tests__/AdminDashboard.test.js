import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { CartProvider } from '../context/CartContext';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../mockApi';

jest.mock('../mockApi');

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('expands order to show items and allows status update', async () => {
    const fakeOrders = [
      { _id: '1', orderId: 'ORD-1', customer: 'Alice', total: 100, status: 'pending', items: [{ name: 'Ginger', price: 10, quantity: 2 }] }
    ];
    api.fetchProducts.mockResolvedValue([]);
    api.fetchOrders.mockResolvedValue(fakeOrders);
    api.fetchAgents.mockResolvedValue([]);
    api.fetchUsers.mockResolvedValue([]);
    api.updateOrderStatusApi.mockResolvedValue({ ...fakeOrders[0], status: 'paid' });

    render(
      <MemoryRouter>
        <CartProvider>
          <AdminDashboard />
        </CartProvider>
      </MemoryRouter>
    );

  await waitFor(() => expect(api.fetchOrders).toHaveBeenCalled());

  // switch to Orders tab - pick the button (there is also a stats label 'Orders')
  const ordersElems = screen.getAllByText('Orders');
  const ordersTab = ordersElems.find(el => el.tagName === 'BUTTON' || el.classList.contains('tab'));
  fireEvent.click(ordersTab);

  // Order details row exists
  expect(await screen.findByText(/ORD-1/)).toBeInTheDocument();

  // Click Details to expand
  const detailsBtn = await screen.findByText(/Details/);
    fireEvent.click(detailsBtn);

    // Now the item name should appear
    expect(await screen.findByText('Ginger')).toBeInTheDocument();

    // Change status select to 'delivered' triggers updateOrderStatus
    const statusSelect = screen.getByDisplayValue('pending');
    fireEvent.change(statusSelect, { target: { value: 'delivered' } });

    await waitFor(() => expect(api.updateOrderStatusApi).toHaveBeenCalled());
  });
});
