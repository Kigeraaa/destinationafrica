'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { logout } from '@/lib/api';

type Role = 'Admin' | 'Operator' | 'Traveler';

interface NavItem {
  label: string;
  href: string;
}

interface DashboardShellProps {
  role: Role;
  children: React.ReactNode;
}

const NAV: Record<Role, NavItem[]> = {
  Admin: [
    { label: 'Overview', href: '/dashboard/admin' },
    { label: 'Users', href: '/dashboard/admin/users' },
    { label: 'Operators', href: '/dashboard/admin/operators' },
    { label: 'Bookings', href: '/dashboard/admin/bookings' },
    { label: 'Payments', href: '/dashboard/admin/payments' },
    { label: 'Reviews', href: '/dashboard/admin/reviews' },
    { label: 'CMS', href: '/dashboard/admin/cms' },
    { label: 'Tickets', href: '/dashboard/admin/tickets' },
  ],
  Operator: [
    { label: 'Overview', href: '/dashboard/operator' },
    { label: 'Tours', href: '/dashboard/operator/tours' },
    { label: 'Bookings', href: '/dashboard/operator/bookings' },
    { label: 'Messages', href: '/dashboard/operator/messages' },
    { label: 'Earnings', href: '/dashboard/operator/earnings' },
    { label: 'Reviews', href: '/dashboard/operator/reviews' },
    { label: 'Subscription', href: '/dashboard/operator/subscription' },
  ],
  Traveler: [
    { label: 'Overview', href: '/dashboard/traveler' },
    { label: 'Bookings', href: '/dashboard/traveler/bookings' },
    { label: 'Wishlist', href: '/dashboard/traveler/wishlist' },
    { label: 'Payments', href: '/dashboard/traveler/payments' },
    { label: 'Messages', href: '/dashboard/traveler/messages' },
    { label: 'Reviews', href: '/dashboard/traveler/reviews' },
    { label: 'Settings', href: '/dashboard/traveler/settings' },
  ],
};

function SidebarContent({ role, pathname, onClose }: { role: Role; pathname: string; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div onClick={onClose}>
        <Logo />
      </div>
      <nav className="mt-8 flex-1 space-y-1">
        {NAV[role].map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                active
                  ? 'bg-forest text-white'
                  : 'text-slate-700 hover:bg-sand dark:text-slate-200'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 space-y-2 border-t pt-4">
        <Link href="/" className="block text-sm font-bold text-earth hover:underline" onClick={onClose}>
          ← Back to marketplace
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-sand/30">
      {/* Desktop sidebar */}
      <aside className="fixed hidden h-full w-72 overflow-y-auto border-r bg-white p-6 lg:block dark:bg-slate-950">
        <SidebarContent role={role} pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden dark:bg-slate-950">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 hover:bg-sand"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-6 shadow-xl dark:bg-slate-950">
            <div className="mb-4 flex justify-end">
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <SidebarContent role={role} pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}