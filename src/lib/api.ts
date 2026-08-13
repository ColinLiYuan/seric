const API_BASE = '/api';

let token: string | null = null;
if (typeof window !== 'undefined') {
  token = localStorage.getItem('admin_token');
}

export function setToken(t: string) {
  token = t;
  localStorage.setItem('admin_token', t);
}

export function getToken() {
  return token;
}

export function clearToken() {
  token = null;
  localStorage.removeItem('admin_token');
}

export function isLoggedIn() {
  return !!token;
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const headers: any = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (data.code === 401) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (data.code !== 200) throw new Error(data.message || 'Request failed');
  return data.data;
}

// Auth
export async function login(username: string, password: string) {
  const data = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  return data;
}

// Products
export const products = {
  list: (params?: any) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? '?' + qs : ''}`);
  },
  getBySlug: (slug: string) => request(`/products/${slug}`),
  create: (d: any) => request('/admin/products', { method: 'POST', body: JSON.stringify(d) }),
  update: (id: number, d: any) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  delete: (id: number) => request(`/admin/products/${id}`, { method: 'DELETE' }),
};

export const blogs = {
  list: () => request('/admin/blogs'),
  create: (d: any) => request('/admin/blogs', { method: 'POST', body: JSON.stringify(d) }),
  update: (id: number, d: any) => request(`/admin/blogs/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  delete: (id: number) => request(`/admin/blogs/${id}`, { method: 'DELETE' }),
};
