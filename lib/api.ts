import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
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
    id: string;
    name: string;
    email: string;
  };
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
}

// ─── Products ───

export interface Product {
  id: string | number;
  name: string;
  price: number;
  stock?: number;
  image?: string;
  description?: string;
  category?: string;
}

export async function getProducts(): Promise<Product[]> {
  const res = await api.get('/products');
  return res.data.payload || res.data;
}

export async function createProduct(data: Pick<Product, 'name' | 'price'> & { image?: string, stock?: number }): Promise<Product> {
  const res = await api.post('/products', data);
  return res.data.payload || res.data;
}

export default api;


