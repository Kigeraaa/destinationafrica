'use client';
import {useEffect,useState} from 'react';
import {DashboardShell} from '@/components/DashboardShell';
import {auth} from '@/lib/api';

const API=()=>process.env.NEXT_PUBLIC_API_URL||'http://localhost:8000';
function Stat({label,value,color=''}:any){
  return <div className="card p-5">
    <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
    <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
  </div>
}

const MOCK_USERS=[
  {id:1,full_name:'Alice Kamau',email:'alice@email.com',role:'traveler',country:'Kenya',created_at:'2026-01-10'},
  {id:2,full_name:'James Osei',email:'james@email.com',role:'traveler',country:'Ghana',created_at:'2026-01-15'},
  {id:3,full_name:'Safari Co',email:'safari@co.com',role:'operator',country:'Tanzania',created_at:'2026-01-20'},
];
const MOCK_OPERATORS=[
  {id:1,company_name:'Safari Co',email:'safari@co.com',country:'Tanzania',subscription_plan:'Professional',status:'approved'},
  {id:2,company_name:'Nile Tours',email:'nile@tours.com',country:'Egypt',subscription_plan:'Free',status:'pending'},
  {id:3,company_name:'Gorilla Treks',email:'gorilla@treks.com',country:'Uganda',subscription_plan:'Enterprise',status:'approved'},
];

export default function Admin(){
  const [d,setD]=useState<any>();
  const [section,setSection]=useState('Overview');
  const [user,setUser]=useState<any>();
  const [comment,setComment]=useState('');
  const [reviews,setReviews]=useState([
    {id:1,author:'Alice K.',text:'Amazing safari experience!',rating:5,date:'2026-05-01'},
    {id:2,author:'James O.',text:'Great guides, very professional.',rating:4,date:'2026-05-10'},
  ]);

  useEffect(()=>{
    const a=auth();
    if(!a){location.href='/auth/login';return}
    setUser(a.user);
    fetch(API()+'/dashboard/admin',{headers:{Authorization:'Bearer '+a.token}})
      .then(r=>r.ok?r.json():null).then(data=>{if(data)setD(data)}).catch(()=>{});
  },[]);

  function addReview(){
    if(!comment.trim())return;
    setReviews(r=>[...r,{id:Date.now(),author:user?.full_name||'Admin',text:comment,rating:5,date:new Date().toISOString().split('T')[0]}]);
    setComment('');
  }

  if(!d)return <DashboardShell role="Admin" activeSection={section} onNav={setSection} user={user}><p className="text-slate-500">Loading dashboard...</p></DashboardShell>;
  const t=d.totals;

  return <DashboardShell role="Admin" activeSection={section} onNav={setSection} user={user}>
    {section==='Overview' && <>
      <h1 className="text-4xl font-black">Admin Dashboard</h1>
      <p className="text-slate-500 mt-1">Platform overview</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Total Users" value={t.users}/>
        <Stat label="Operators" value={t.operators}/>
        <Stat label="Tours" value={t.tours}/>
        <Stat label="Bookings" value={t.bookings}/>
        <Stat label="GMV" value={'$'+Math.round(t.gmv)} color="text-forest"/>
        <Stat label="Commission" value={'$'+Math.round(t.admin_commission)} color="text-forest"/>
        <Stat label="Pending Operators" value={t.pending_operators} color="text-amber-600"/>
        <Stat label="Approved Operators" value={t.approved_operators} color="text-green-600"/>
      </div>
      <h2 className="mt-8 text-2xl font-black">Recent Bookings</h2>
      <div className="mt-3 space-y-2">
        {d.recent_bookings.map((b:any)=>(
          <div key={b.id} className="card p-4 flex items-center justify-between">
            <span>Booking #{b.id}</span>
            <span className="font-bold">${b.total_amount}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${b.status==='confirmed'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{b.status}</span>
          </div>
        ))}
      </div>
    </>}

    {section==='Users' && <>
      <h1 className="text-4xl font-black">Users</h1>
      <p className="text-slate-500 mt-1">{MOCK_USERS.length} registered users</p>
      <div className="mt-6 space-y-3">
        {MOCK_USERS.map(u=>(
          <div key={u.id} className="card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-forest text-white flex items-center justify-center font-black text-sm">{u.full_name[0]}</div>
            <div className="flex-1">
              <p className="font-bold">{u.full_name}</p>
              <p className="text-sm text-slate-500">{u.email} · {u.country}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${u.role==='operator'?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'}`}>{u.role}</span>
            <span className="text-xs text-slate-400">{u.created_at}</span>
          </div>
        ))}
      </div>
    </>}

    {section==='Operators' && <>
      <h1 className="text-4xl font-black">Operators</h1>
      <p className="text-slate-500 mt-1">{MOCK_OPERATORS.length} operators · {t.pending_operators} pending approval</p>
      <div className="mt-6 space-y-3">
        {MOCK_OPERATORS.map(o=>(
          <div key={o.id} className="card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-earth text-white flex items-center justify-center font-black text-sm">{o.company_name[0]}</div>
            <div className="flex-1">
              <p className="font-bold">{o.company_name}</p>
              <p className="text-sm text-slate-500">{o.email} · {o.country} · {o.subscription_plan}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${o.status==='approved'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{o.status}</span>
            {o.status==='pending' && <button className="btn-primary py-1 px-3 text-xs">Approve</button>}
          </div>
        ))}
      </div>
    </>}

    {section==='Bookings' && <>
      <h1 className="text-4xl font-black">All Bookings</h1>
      <div className="mt-6 space-y-2">
        {d.recent_bookings.map((b:any)=>(
          <div key={b.id} className="card p-4 grid grid-cols-4 gap-4 items-center">
            <span className="font-bold">#{b.id}</span>
            <span>${b.total_amount}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold text-center ${b.status==='confirmed'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{b.status}</span>
            <button className="text-xs text-blue-600 hover:underline text-right">View details</button>
          </div>
        ))}
      </div>
    </>}

    {section==='Payments' && <>
      <h1 className="text-4xl font-black">Payment Logs</h1>
      <div className="mt-6 space-y-2">
        {d.payments.map((p:any)=>(
          <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
            <span className="font-mono text-sm">{p.reference}</span>
            <span className="text-sm text-slate-500">{p.provider}</span>
            <span className="font-bold">${p.amount}</span>
            <span className="text-sm text-green-600">Commission ${p.admin_commission}</span>
          </div>
        ))}
      </div>
    </>}

    {section==='Reviews' && <>
      <h1 className="text-4xl font-black">Reviews</h1>
      <div className="mt-6 card p-4">
        <p className="font-bold mb-3">Add a comment</p>
        <textarea value={comment} onChange={e=>setComment(e.target.value)}
          className="input w-full h-24 resize-none" placeholder="Write a review or note..."/>
        <button onClick={addReview} className="btn-primary mt-3">Post review</button>
      </div>
      <div className="mt-4 space-y-3">
        {reviews.map(r=>(
          <div key={r.id} className="card p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-full bg-forest text-white flex items-center justify-center text-xs font-black">{r.author[0]}</div>
              <div>
                <p className="text-sm font-bold">{r.author}</p>
                <p className="text-xs text-slate-400">{r.date}</p>
              </div>
              <span className="ml-auto text-yellow-500">{'★'.repeat(r.rating)}</span>
            </div>
            <p className="text-sm text-slate-600">{r.text}</p>
          </div>
        ))}
      </div>
    </>}

    {section==='CMS' && <>
      <h1 className="text-4xl font-black">Content Management</h1>
      <p className="text-slate-500 mt-1">Manage site content, banners and announcements</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-5"><p className="font-bold">Homepage Banner</p><p className="text-sm text-slate-500 mt-1">Edit hero text and images</p><button className="btn-primary mt-3 text-sm py-2">Edit</button></div>
        <div className="card p-5"><p className="font-bold">Featured Tours</p><p className="text-sm text-slate-500 mt-1">Choose which tours appear on homepage</p><button className="btn-primary mt-3 text-sm py-2">Manage</button></div>
        <div className="card p-5"><p className="font-bold">Announcements</p><p className="text-sm text-slate-500 mt-1">Post platform-wide notices</p><button className="btn-primary mt-3 text-sm py-2">Post</button></div>
        <div className="card p-5"><p className="font-bold">SEO Settings</p><p className="text-sm text-slate-500 mt-1">Meta titles, descriptions</p><button className="btn-primary mt-3 text-sm py-2">Configure</button></div>
      </div>
    </>}

    {section==='Tickets' && <>
      <h1 className="text-4xl font-black">Support Tickets</h1>
      <p className="text-slate-500 mt-1">No open tickets</p>
      <div className="mt-6 card p-8 text-center text-slate-400">
        <p className="text-4xl mb-3">🎫</p>
        <p>All caught up! No pending support tickets.</p>
      </div>
    </>}
  </DashboardShell>
}