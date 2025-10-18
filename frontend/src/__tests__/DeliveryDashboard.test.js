import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DeliveryDashboard from '../pages/DeliveryDashboard';
import { CartProvider } from '../context/CartContext';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../mockApi';

jest.mock('../mockApi');

describe('DeliveryDashboard claim flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // set current agent
    localStorage.setItem('currentUser', JSON.stringify({ name: 'Agent', email: 'agent@example.com', role: 'delivery' }));
  });

  test('shows unassigned shipments and allows claim', async () => {
    const orders = [
      { id: 'ORD-1', orderId: 'ORD-1', customer: 'User A', total: 100, status: 'paid', assignedTo: null }
    ];
    api.fetchOrders.mockResolvedValue(orders);

    render(
      <MemoryRouter>
        <CartProvider>
          <DeliveryDashboard />
        </CartProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(api.fetchOrders).toHaveBeenCalled());

    expect(screen.getByText(/Unassigned Shipments/)).toBeInTheDocument();

  const claimBtn = await screen.findByText(/Claim/);
  fireEvent.click(claimBtn);

  // After claim, the unassigned list should show 'No unassigned shipments'
  expect(await screen.findByText('No unassigned shipments')).toBeInTheDocument();
  });
});
