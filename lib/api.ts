import axios from 'axios';

function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return apiUrl;
}

async function readJsonResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data as { message?: string; error?: string }).message ||
      (data as { message?: string; error?: string }).error ||
      'Request failed';
    throw new Error(message);
  }

  return data as T;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Auth ───

export interface LoginResponse {
  token: string;
  user?: {
    id: string | number;
    name: string;
    email: string;
    role: 'admin' | 'customer';
  };
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string | number;
    name: string;
    email: string;
    role: 'admin' | 'customer';
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${getApiUrl()}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return readJsonResponse<LoginResponse>(res);
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
  const res = await fetch(`${getApiUrl()}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  return readJsonResponse<RegisterResponse>(res);
}

// ─── Products ───

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

export async function getProducts(): Promise<Product[]> {
  const res = await api.get('/products');
  return res.data;
}

export async function createProduct(data: Pick<Product, 'name' | 'price'> & { image?: string }): Promise<Product> {
  const res = await api.post('/products', data);
  return res.data;
}

export default api;
