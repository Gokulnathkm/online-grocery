import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";

function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    placeOrder,
  } = useCart();

  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const history = useHistory();

  // Empty cart
  if (!cart || cart.length === 0) {
    return (
      <div>
        <Navbar />

        <div className="empty-cart">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <p>Your cart is empty</p>

          <button
            className="btn primary"
            style={{ marginTop: 16 }}
            onClick={() => history.push("/dashboard")}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const openPayment = () => setShowPayment(true);
  const closePayment = () => setShowPayment(false);

  const handleSimulatePayment = async (method = "upi") => {
    // ==========================
    // CASH ON DELIVERY
    // ==========================
    if (method === "cod") {
      try {
        setPaymentProcessing(true);

        await new Promise((r) => setTimeout(r, 800));

        const summary = await placeOrder(
          {
            name: "Customer",
            address: "N/A",
            payment: "Cash on Delivery",
          },
          { paid: false }
        );

        setPaymentProcessing(false);
        closePayment();

        if (summary) {
          history.push("/order-confirmation", { order: summary });
        }
      } catch (error) {
        console.error(error);
        setPaymentProcessing(false);
        alert("Order Failed");
      }

      return;
    }

    // ==========================
    // UPI PAYMENT (SIMULATED)
    // ==========================
    try {
      setPaymentProcessing(true);

      // Simulate payment processing delay
      await new Promise((r) => setTimeout(r, 1200));

      const summary = await placeOrder(
        {
          name: "Customer",
          address: "N/A",
          payment: "UPI",
        },
        { paid: true }
      );

      setPaymentProcessing(false);
      closePayment();

      if (summary) {
        history.push("/order-confirmation", { order: summary });
      }
    } catch (error) {
      console.error(error);
      setPaymentProcessing(false);
      alert("Payment Failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="cart-page">
        <h2>🛍️ Your Cart</h2>

        {/* Cart Items */}
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <strong>{item.name}</strong>

                <span
                  style={{
                    color: "var(--text-muted)",
                    margin: "0 8px",
                  }}
                >
                  ₹{item.price} × {item.quantity}
                </span>

                <span
                  style={{
                    color: "var(--accent-emerald)",
                    fontWeight: 700,
                  }}
                >
                  = ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>

              <div className="cart-item-actions">
                <button
                  className="btn small"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                >
                  −
                </button>

                <span
                  style={{
                    minWidth: 28,
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  className="btn small"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  className="btn danger small"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="cart-total">
          Total: ₹{totalPrice.toFixed(2)}
        </div>

        {/* Proceed Button */}
        <button
          className="btn primary btn-block"
          style={{
            marginTop: 16,
            padding: "14px 20px",
            fontSize: 16,
          }}
          onClick={openPayment}
        >
          Proceed to Payment
        </button>

        {/* Payment Modal */}
        {showPayment && (
          <div
            className="payment-overlay"
            onClick={closePayment}
          >
            <div
              className="payment-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>💳 Payment</h3>

              <p>
                Total to pay:{" "}
                <strong
                  style={{
                    color: "var(--accent-emerald)",
                  }}
                >
                  ₹{totalPrice.toFixed(2)}
                </strong>
              </p>

              <div className="payment-methods">
                <button
                  className="btn primary btn-block"
                  disabled={paymentProcessing}
                  onClick={() => handleSimulatePayment("upi")}
                >
                  {paymentProcessing ? "Processing..." : "📱 Pay with UPI"}
                </button>

                <button
                  className="btn btn-block"
                  disabled={paymentProcessing}
                  onClick={() => handleSimulatePayment("cod")}
                >
                  {paymentProcessing ? "Processing..." : "🏠 Cash on Delivery"}
                </button>
              </div>

              <button
                className="btn ghost btn-block"
                style={{ marginTop: 12 }}
                onClick={closePayment}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;

