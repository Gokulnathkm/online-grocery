// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import CustomerDashboard from "./pages/CustomerDashboard";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ShopDashboard from "./pages/ShopDashboard";
import Profile from "./pages/Profile";

function isAuthed() {
  try { return !!localStorage.getItem('token'); } catch { return false; }
}
function getRole() {
  try { return JSON.parse(localStorage.getItem('currentUser') || 'null')?.role || null; } catch { return null; }
}

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!isAuthed()) return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      if (roles && roles.length && !roles.includes(getRole())) return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      return <Component {...props} />;
    }}
  />
);

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/admin/register" component={AdminRegister} />
        <Route path="/admin/login" component={AdminLogin} />
        <PrivateRoute path="/dashboard" component={CustomerDashboard} roles={["customer"]} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation" component={OrderConfirmation} />
        <PrivateRoute path="/admin" component={AdminDashboard} roles={["admin"]} />
        <PrivateRoute path="/delivery" component={DeliveryDashboard} roles={["admin", "delivery"]} />
        <PrivateRoute path="/profile" component={Profile} roles={["customer","admin","delivery"]} />
        <Route path="/shop" component={ShopDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
