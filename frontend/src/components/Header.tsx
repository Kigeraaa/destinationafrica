'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { auth, logout, AuthData } from '@/lib/api';

const NAV_LINKS = [
  { href: '/tours', label: 'Tours' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/guides', label: 'Travel Guides' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthData | null>(null);

  useEffect(() => {
    setUser(auth());
  }, []);

  const dashboardHref =
    user?.user.role === 'admin'
      ? '/dashboard/admin'
      : user?.user.role === 'operator'
      ? '/dashboard/operator'
      : '/dashboard/traveler';

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} className="navlink" href={l.href}>
              {l.label}
            </Link>
          ))}
          {user && (
            <Link className="navlink" href={dashboardHref}>
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {user.user.full_name || user.user.email}
              </span>
              <button onClick={logout} className="btn btn-primary py-2">
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-primary py-2" href="/auth/login">
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-xl p-2 md:hidden hover:bg-sand"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t bg-white px-4 pb-6 dark:bg-slate-950 md:hidden">
          <nav className="mt-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-sand dark:text-slate-200"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                href={dashboardHref}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-sand dark:text-slate-200"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
          <div className="mt-4 border-t pt-4">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{user.user.email}</span>
                <button onClick={logout} className="btn btn-primary py-2 text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="btn btn-primary block w-full py-3 text-center"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}