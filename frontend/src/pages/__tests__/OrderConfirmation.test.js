import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import OrderConfirmation from '../OrderConfirmation';

test('renders order confirmation with items and total', () => {
  const order = {
    id: 'ORD-1',
    name: 'Test User',
    address: '123 Main St',
    paymentMethod: 'cod',
    items: [ { id: 'p1', name: 'Garlic', qty: 1, priceValue: 80 }, { id: 'p2', name: 'Onions', qty: 1, priceValue: 50 } ],
    total: 130
  };

  render(
    <MemoryRouter initialEntries={[{ pathname: '/order-confirmation', state: { order } }]}>
      <Route path="/order-confirmation">
        <OrderConfirmation />
      </Route>
    </MemoryRouter>
  );

  expect(screen.getByText(/Thank you/i)).toBeInTheDocument();
  expect(screen.getByText(/Order ID:/i)).toHaveTextContent('Order ID: ORD-1');
  expect(screen.getByText(/Garlic x 1/)).toBeInTheDocument();
  expect(screen.getByText(/Total: ₹130/)).toBeInTheDocument();
});
