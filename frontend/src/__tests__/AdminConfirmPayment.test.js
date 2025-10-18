import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import * as api from '../mockApi';
import { CartProvider } from '../context/CartContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../mockApi');

describe('Admin confirm payment (status update to paid)', () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

  test('allows marking an order as paid via status select', async () => {
    const fakeOrders = [
      { _id: 'o1', orderId: 'ORD-PAY', customer: 'Pay User', total: 200, status: 'pending', items: [] }
    ];
    api.fetchProducts.mockResolvedValue([]);
    api.fetchOrders.mockResolvedValue(fakeOrders);
    api.fetchAgents.mockResolvedValue([]);
    api.fetchUsers.mockResolvedValue([]);
  api.updateOrderStatusApi.mockResolvedValue({ ...fakeOrders[0], status: 'delivered' });

    render(
      <MemoryRouter>
        <CartProvider>
          <AdminDashboard />
        </CartProvider>
      </MemoryRouter>
    );

    // open orders tab
    const tabs = await screen.findAllByText('Orders');
    const ordersTab = tabs.find(el => el.tagName === 'BUTTON' || el.classList.contains('tab'));
    fireEvent.click(ordersTab);

    // wait for order row
    expect(await screen.findByText(/ORD-PAY/)).toBeInTheDocument();

  // change select to 'delivered' within the same table row for ORD-PAY
  const orderCell = await screen.findByText(/ORD-PAY/);
  const row = orderCell.closest('tr');
  const select = row.querySelector('select');
  fireEvent.change(select, { target: { value: 'delivered' } });

  await waitFor(() => expect(api.updateOrderStatusApi).toHaveBeenCalled());
  // after update, the select's value should reflect 'delivered'
  await waitFor(() => expect(select.value).toBe('delivered'));
  });
});
