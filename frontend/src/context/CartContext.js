import React, { createContext, useContext, useState } from "react";
import { createOrderApi, updateOrderStatusApi } from "../mockApi";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = async (form, options = {}) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const orderId = `ORD-${Date.now()}`;
    const order = {
      orderId,
      customerName: currentUser?.name || form?.name || 'Customer',
      customerEmail: currentUser?.email || '',
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items: cart.map(item => ({ productId: String(item.id), name: item.name, price: item.price, quantity: item.quantity }))
    };
    const paid = !!options.paid;
    let created = null;
    try {
      // create order on backend (backend default status is 'pending')
      created = await createOrderApi(order);
      // if payment completed, mark as paid
      if (created && paid) {
        try { created = await updateOrderStatusApi(created._id || created.id, 'paid'); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      // fallback to localStorage when backend unavailable
      const existingOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
      const fallback = { id: orderId, customer: order.customerName, total: order.total, status: paid ? 'paid' : 'pending', items: order.items };
      try { localStorage.setItem('admin_orders', JSON.stringify([fallback, ...existingOrders])); } catch {}
      created = { _id: orderId, orderId, ...fallback };
    }

    // Prepare a frontend-friendly order summary for confirmation page
    const summary = {
      id: created._id || created.id || orderId,
      orderId: created.orderId || orderId,
      name: order.customerName,
      address: form.address || '',
      paymentMethod: form.payment || (paid ? 'online' : 'COD'),
      items: order.items.map(it => ({ id: it.productId, name: it.name, qty: it.quantity, priceValue: it.price })),
      total: order.total,
      status: (created.status || (paid ? 'paid' : 'pending'))
    };

    setCart([]);
    return summary;
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0); 

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        placeOrder,
        totalPrice,
        cartCount, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
