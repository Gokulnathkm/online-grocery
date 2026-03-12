// frontend/src/mockApi.js

const API =
  process.env.REACT_APP_API_URL ||
  "https://online-grocery-gc6r.onrender.com";

// ================= HELPERS =================
const getToken = () => localStorage.getItem("token");

const authHeaders = () =>
  getToken() ? { Authorization: `Bearer ${getToken()}` } : {};

async function handleJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.msg || data.message || "Request failed");
  }
  return data;
}

// ================= AUTH =================
export const registerUser = async (userData) => {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await handleJson(res);
  return { success: true, msg: data.msg };
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleJson(res);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return {
    success: true,
    user: {
      name: data.name,
      email: data.email,
      role: data.role,
    },
  };
};

// ================= PRODUCTS =================
export const fetchProducts = async () => {
  const res = await fetch(`${API}/api/products`);
  return handleJson(res);
};

export const createProduct = async (product) => {
  const res = await fetch(`${API}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(product),
  });
  return handleJson(res);
};

export const updateProduct = async (id, updates) => {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(updates),
  });
  return handleJson(res);
};

export const deleteProductApi = async (id) => {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleJson(res);
};
// Adjust product stock (+ / -)
export const adjustProductStock = async (id, delta) => {
  const res = await fetch(`${API}/api/products/${id}/adjust-stock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ delta }),
  });
  return handleJson(res);
};
// ================= ORDERS =================
export const fetchOrders = async () => {
  const res = await fetch(`${API}/api/orders`, {
    headers: authHeaders(),
  });
  return handleJson(res);
};

// ✅ THIS WAS MISSING
export const createOrderApi = async (order) => {
  const res = await fetch(`${API}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  return handleJson(res);
};

export const updateOrderStatusApi = async (id, status) => {
  const res = await fetch(`${API}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  return handleJson(res);
};

export const assignOrderApi = async (id, assignedTo) => {
  const res = await fetch(`${API}/api/orders/${id}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ assignedTo }),
  });
  return handleJson(res);
};

// ================= USERS / AGENTS =================
export const fetchAgents = async () => {
  const res = await fetch(`${API}/api/agents`, {
    headers: authHeaders(),
  });
  return handleJson(res);
};

export const fetchUsers = async () => {
  const res = await fetch(`${API}/api/users`, {
    headers: authHeaders(),
  });
  return handleJson(res);
};
