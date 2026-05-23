'use client';
import { useState } from 'react';
import { api, saveAuth } from '@/lib/api';
import { Logo } from '@/components/Logo';

type Role = 'traveler' | 'operator';

export default function Register() {
  const [role, setRole] = useState<Role>('traveler');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries()) as Record<string, string>;
    body.role = role;
    try {
      const r = await api.register(body);
      saveAuth(r);
      window.location.href = role === 'operator' ? '/dashboard/operator' : '/dashboard/traveler';
    } catch {
      setErr('Registration failed. That email may already be registered.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-sand/40 p-6">
      <form onSubmit={submit} className="card w-full max-w-2xl p-8">
        <Logo />
        <h1 className="mt-8 text-3xl font-black">Create account</h1>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setRole('traveler')}
            className={`btn ${role === 'traveler' ? 'bg-forest text-white' : 'bg-sand text-slate-700'}`}
          >
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole('operator')}
            className={`btn ${role === 'operator' ? 'bg-forest text-white' : 'bg-sand text-slate-700'}`}
          >
            Tour Operator
          </button>
        </div>

        {role === 'traveler' ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input name="full_name" className="input" placeholder="Full name" required />
            <input name="email" className="input" type="email" placeholder="Email" required />
            <input name="phone" className="input" placeholder="Phone number" />
            <input name="country" className="input" placeholder="Country of residence" />
            <input name="interests" className="input md:col-span-2" placeholder="Travel interests (e.g. safari, beach, culture)" />
            <input name="password" className="input md:col-span-2" type="password" placeholder="Password" required minLength={8} />
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input name="company_name" className="input" placeholder="Company name" required />
            <input name="contact_person" className="input" placeholder="Contact person" required />
            <input name="email" className="input" type="email" placeholder="Email" required />
            <input name="phone" className="input" placeholder="Phone number" />
            <input name="country" className="input" placeholder="Country" />
            <input name="city" className="input" placeholder="City" />
            <input name="business_registration_number" className="input" placeholder="Business registration no." />
            <input name="license_number" className="input" placeholder="Operator license no." />
            <input name="website" className="input md:col-span-2" placeholder="Website or social link" />
            <select name="subscription_plan" className="input">
              <option value="Free">Free</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <textarea name="description" className="input" placeholder="Company description" />
            <input name="password" className="input md:col-span-2" type="password" placeholder="Password" required minLength={8} />
          </div>
        )}

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input required type="checkbox" className="rounded" />
          I accept the terms and conditions
        </label>

        <button className="btn btn-primary mt-5 w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        {err && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}

        <a className="mt-4 block text-sm font-bold text-forest hover:underline" href="/auth/login">
          Already have an account? Login →
        </a>
      </form>
    </main>
  );
}