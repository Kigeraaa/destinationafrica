'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, saveAuth } from '@/lib/api';
import { Logo } from '@/components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await api.login(email, password);
      saveAuth(r);
      const redirect = searchParams.get('redirect');
      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href =
          r.user.role === 'admin'
            ? '/dashboard/admin'
            : r.user.role === 'operator'
            ? '/dashboard/operator'
            : '/dashboard/traveler';
      }
    } catch {
      setErr('Login failed. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-sand/40 p-6">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-8 text-3xl font-black">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your Destination Africa account.</p>

        <input
          className="input mt-5"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          autoComplete="email"
        />
        <input
          className="input mt-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
        />
        <button className="btn btn-primary mt-5 w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>

        {err && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}

        <a className="mt-4 block text-sm font-bold text-forest hover:underline" href="/auth/register">
          Create account →
        </a>
      </form>
    </main>
  );
}