'use client';
import {useState} from 'react';
import Link from 'next/link';
import {Logo} from './Logo';

const NAV:Record<string,{label:string,icon:string}[]> = {
  Admin:[
    {label:'Overview',icon:'🏠'},{label:'Users',icon:'👥'},{label:'Operators',icon:'🏢'},
    {label:'Bookings',icon:'📅'},{label:'Payments',icon:'💳'},{label:'Reviews',icon:'⭐'},
    {label:'CMS',icon:'📝'},{label:'Tickets',icon:'🎫'},
  ],
  Operator:[
    {label:'Overview',icon:'🏠'},{label:'Tours',icon:'🗺️'},{label:'Bookings',icon:'📅'},
    {label:'Messages',icon:'💬'},{label:'Earnings',icon:'💰'},{label:'Reviews',icon:'⭐'},
    {label:'Subscription',icon:'🔑'},
  ],
  Traveler:[
    {label:'Overview',icon:'🏠'},{label:'Bookings',icon:'📅'},{label:'Wishlist',icon:'❤️'},
    {label:'Payments',icon:'💳'},{label:'Messages',icon:'💬'},{label:'Reviews',icon:'⭐'},
    {label:'Settings',icon:'⚙️'},
  ],
};

export function DashboardShell({role,activeSection,onNav,user,children}:any){
  const [mobileOpen,setMobileOpen]=useState(false);
  const links=NAV[role]||NAV.Traveler;

  function logout(){
    localStorage.removeItem('da_auth');
    location.href='/';
  }

  const Sidebar=()=>(
    <div className="flex flex-col h-full">
      <Logo/>
      {user && (
        <div className="mt-6 rounded-2xl bg-sand/50 p-3">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-sm font-bold truncate">{user.full_name||user.company_name||user.email}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
      )}
      <div className="mt-6 space-y-1 flex-1">
        {links.map((l:any)=>(
          <button key={l.label}
            onClick={()=>{onNav&&onNav(l.label);setMobileOpen(false)}}
            className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors flex items-center gap-3
              ${activeSection===l.label?'bg-forest text-white':'hover:bg-sand'}`}>
            <span>{l.icon}</span>{l.label}
          </button>
        ))}
      </div>
      <div className="mt-6 border-t pt-4 space-y-1">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-earth hover:bg-sand rounded-2xl">
          ← Back to marketplace
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl">
          → Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand/30">
      {/* Desktop sidebar */}
      <aside className="fixed hidden h-full w-72 border-r bg-white p-6 lg:flex flex-col overflow-y-auto">
        <Sidebar/>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3">
        <Logo/>
        <button onClick={()=>setMobileOpen(true)} className="rounded-xl border p-2 text-sm font-bold">☰ Menu</button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setMobileOpen(false)}/>
          <aside className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">{role} Menu</span>
              <button onClick={()=>setMobileOpen(false)} className="text-xl">✕</button>
            </div>
            <Sidebar/>
          </aside>
        </div>
      )}

      <main className="lg:pl-72">
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}