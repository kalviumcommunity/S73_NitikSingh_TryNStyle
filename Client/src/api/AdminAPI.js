const BASE_URL = "http://localhost:8000"; // 🔁 Replace with your backend URL if deployed

async function checkResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'API request failed');
  }
  return res.json();
}

export async function fetchUserCount() {
  const res = await fetch(`${BASE_URL}/api/admin/users/count`);
  return checkResponse(res);
}

export async function fetchOrdersCount() {
  const res = await fetch(`${BASE_URL}/api/admin/orders/count`);
  return checkResponse(res);
}

export async function fetchRevenueTotal() {
  const res = await fetch(`${BASE_URL}/api/admin/revenue/total`);
  return checkResponse(res);
}

export async function fetchLowStock() {
  const res = await fetch(`${BASE_URL}/api/admin/inventory/low`);
  return checkResponse(res);
}

export async function fetchRecentOrders() {
  const res = await fetch(`${BASE_URL}/api/admin/orders/recent`);
  return checkResponse(res);
}

export async function addInventory(productId, quantity) {
  const res = await fetch(`${BASE_URL}/api/admin/inventory/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  });
  return checkResponse(res);
}

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/api/products/get-products`); // updated path here
  return checkResponse(res);
}
