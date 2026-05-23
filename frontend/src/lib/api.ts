const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AuthUser {
  id: number;
  email: string;
  role: 'admin' | 'operator' | 'traveler';
  full_name?: string;
  company_name?: string;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export interface Tour {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  duration_days: number;
  group_size: number;
  rating: number;
  review_count: number;
  image_url: string;
  availability: string[];
  itinerary: string[];
  country?: { name: string };
  category?: { name: string };
  destination?: { name: string };
  operator?: { company_name: string };
}

export interface Country {
  id: number;
  slug: string;
  name: string;
  image_url: string;
}

export interface Guide {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
}

export interface Booking {
  id: number;
  total_amount: number;
  status: string;
  travel_date: string;
  tour?: { title: string };
}

export interface Message {
  id: number;
  body: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const r = await fetch(API + path, { cache: 'no-store', ...options });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    }),
  authGet: <T>(path: string, token: string) =>
    request<T>(path, { headers: { Authorization: `Bearer ${token}` } }),
  login: (email: string, password: string) =>
    api.post<AuthData>('/auth/login', { email, password }),
  register: (body: Record<string, string>) =>
    api.post<AuthData>('/auth/register', body),
};

export function auth(): AuthData | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('da_auth') || 'null');
  } catch {
    return null;
  }
}

export function saveAuth(x: AuthData): void {
  localStorage.setItem('da_auth', JSON.stringify(x));
  // Also set cookie so middleware can read it
  document.cookie = `da_token=${x.token}; path=/; max-age=86400; SameSite=Lax`;
}

export function logout(): void {
  localStorage.removeItem('da_auth');
  document.cookie = 'da_token=; path=/; max-age=0';
  window.location.href = '/auth/login';
}