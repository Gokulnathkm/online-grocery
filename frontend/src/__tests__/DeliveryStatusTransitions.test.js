import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DeliveryDashboard from '../pages/DeliveryDashboard';
import * as api from '../mockApi';
import { CartProvider } from '../context/CartContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../mockApi');

describe('Delivery status transitions', () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); localStorage.setItem('currentUser', JSON.stringify({ name: 'Agent', email: 'agent@example.com', role: 'delivery' })); });

  test('claim and progress through statuses', async () => {
    const orders = [ { id: 'D1', orderId: 'D1', customer: 'Cust', total: 100, status: 'paid', assignedTo: null } ];
    api.fetchOrders.mockResolvedValue(orders);

    render(
      <MemoryRouter>
        <CartProvider>
          <DeliveryDashboard />
        </CartProvider>
      </MemoryRouter>
    );

    // claim
    const claimBtn = await screen.findByText(/Claim/);
    fireEvent.click(claimBtn);

  // Now should appear under My Deliveries. Find status badge/select
  expect(await screen.findByText(/My Deliveries/)).toBeInTheDocument();

  // Claim auto-sets status to 'shipped' for paid orders; find the row and its select
  const orderCell = await screen.findByText('D1');
  const row = orderCell.closest('tr');
  const select = row.querySelector('select');

  // After claim, the badge should show 'shipped'
  await waitFor(() => expect(row).toHaveTextContent('shipped'));

  // progress to picked_up
  fireEvent.change(select, { target: { value: 'picked_up' } });
  await waitFor(() => expect(row).toHaveTextContent('picked_up'));

  // progress to out_for_delivery
  fireEvent.change(select, { target: { value: 'out_for_delivery' } });
  await waitFor(() => expect(row).toHaveTextContent('out_for_delivery'));

  // finally deliver
  fireEvent.change(select, { target: { value: 'delivered' } });
  await waitFor(() => expect(row).toHaveTextContent('delivered'));
  });
});
