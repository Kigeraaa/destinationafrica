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

export default function Operator(){
  const [d,setD]=useState<any>();
  const [section,setSection]=useState('Overview');
  const [user,setUser]=useState<any>();
  const [comment,setComment]=useState('');
  const [reviews,setReviews]=useState([
    {id:1,author:'Alice K.',text:'Fantastic tour, highly recommend!',rating:5,tour:'Serengeti Safari',date:'2026-04-20'},
    {id:2,author:'John M.',text:'Well organised, great value.',rating:4,tour:'Kilimanjaro Trek',date:'2026-05-02'},
  ]);
  const [newTour,setNewTour]=useState({title:'',price:'',duration_days:'',description:''});

  useEffect(()=>{
    const a=auth();
    if(!a){location.href='/auth/login';return}
    setUser(a.user);
    fetch(API()+'/dashboard/operator',{headers:{Authorization:'Bearer '+a.token}})
      .then(r=>r.ok?r.json():null).then(data=>{if(data)setD(data)}).catch(()=>{});
  },[]);

  function addReview(){
    if(!comment.trim())return;
    setReviews(r=>[...r,{id:Date.now(),author:'You (Operator)',text:comment,rating:5,tour:'General',date:new Date().toISOString().split('T')[0]}]);
    setComment('');
  }

  if(!d)return <DashboardShell role="Operator" activeSection={section} onNav={setSection} user={user}><p className="text-slate-500">Loading dashboard...</p></DashboardShell>;

  return <DashboardShell role="Operator" activeSection={section} onNav={setSection} user={user}>
    {section==='Overview' && <>
      <h1 className="text-4xl font-black">Operator Dashboard</h1>
      <p className="text-slate-500 mt-1">{d.operator.company_name} · <span className="font-bold text-forest">{d.operator.subscription_plan}</span> plan</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Tours" value={d.tours.length}/>
        <Stat label="Bookings" value={d.bookings.length}/>
        <Stat label="Reviews" value={d.reviews.length}/>
        <Stat label="Earnings" value={'$'+Math.round(d.earnings)} color="text-forest"/>
      </div>
      <h2 className="mt-8 text-2xl font-black">Recent Bookings</h2>
      <div className="mt-3 space-y-2">
        {d.bookings.slice(0,5).map((b:any)=>(
          <div key={b.id} className="card p-4 flex items-center justify-between">
            <span className="font-bold">Booking #{b.id}</span>
            <span className="text-slate-500 text-sm">{b.travel_date}</span>
            <span className="font-bold">${b.total_amount}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${b.status==='confirmed'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{b.status}</span>
          </div>
        ))}
      </div>
    </>}

    {section==='Tours' && <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black">My Tours</h1>
        <button onClick={()=>setSection('AddTour')} className="btn-primary">+ Add Tour</button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {d.tours.map((t:any)=>(
          <div key={t.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-black">{t.title}</p>
                <p className="text-sm text-slate-500 mt-1">${t.price} · {t.duration_days} days · ⭐{t.rating}</p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">Active</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="text-xs border rounded-xl px-3 py-1 hover:bg-sand">Edit</button>
              <button className="text-xs border rounded-xl px-3 py-1 hover:bg-red-50 text-red-500">Pause</button>
            </div>
          </div>
        ))}
      </div>
    </>}

    {section==='AddTour' && <>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>setSection('Tours')} className="text-sm text-slate-500 hover:text-slate-700">← Back</button>
        <h1 className="text-4xl font-black">Add New Tour</h1>
      </div>
      <div className="card p-6 max-w-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><label className="text-sm font-bold">Tour Title</label><input className="input mt-1 w-full" value={newTour.title} onChange={e=>setNewTour(t=>({...t,title:e.target.value}))} placeholder="e.g. Serengeti 5-Day Safari"/></div>
          <div><label className="text-sm font-bold">Price (USD)</label><input className="input mt-1 w-full" value={newTour.price} onChange={e=>setNewTour(t=>({...t,price:e.target.value}))} placeholder="e.g. 1200"/></div>
          <div><label className="text-sm font-bold">Duration (days)</label><input className="input mt-1 w-full" value={newTour.duration_days} onChange={e=>setNewTour(t=>({...t,duration_days:e.target.value}))} placeholder="e.g. 5"/></div>
          <div className="md:col-span-2"><label className="text-sm font-bold">Description</label><textarea className="input mt-1 w-full h-28 resize-none" value={newTour.description} onChange={e=>setNewTour(t=>({...t,description:e.target.value}))} placeholder="Describe the tour experience..."/></div>
        </div>
        <button className="btn-primary mt-4" onClick={()=>{alert('Tour submitted for review!');setSection('Tours');}}>Submit Tour</button>
      </div>
    </>}

    {section==='Bookings' && <>
      <h1 className="text-4xl font-black">Bookings</h1>
      <div className="mt-6 space-y-3">
        {d.bookings.map((b:any)=>(
          <div key={b.id} className="card p-4 grid grid-cols-4 gap-4 items-center">
            <span className="font-bold">#{b.id}</span>
            <span className="text-sm text-slate-500">{b.travel_date||'TBD'}</span>
            <span className="font-bold">${b.total_amount}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold text-center ${b.status==='confirmed'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{b.status}</span>
          </div>
        ))}
      </div>
    </>}

    {section==='Messages' && <>
      <h1 className="text-4xl font-black">Messages</h1>
      <div className="mt-6 card p-8 text-center text-slate-400">
        <p className="text-4xl mb-3">💬</p>
        <p>No messages yet. Travelers will contact you here when they enquire about your tours.</p>
      </div>
    </>}

    {section==='Earnings' && <>
      <h1 className="text-4xl font-black">Earnings</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat label="Total Earnings" value={'$'+Math.round(d.earnings)} color="text-forest"/>
        <Stat label="This Month" value={'$'+Math.round(d.earnings*0.3)} color="text-forest"/>
        <Stat label="Pending Payout" value={'$'+Math.round(d.earnings*0.1)} color="text-amber-600"/>
      </div>
      <div className="mt-6 card p-5">
        <p className="font-bold">Payout Method</p>
        <p className="text-sm text-slate-500 mt-1">No payout method configured yet.</p>
        <button className="btn-primary mt-3 text-sm py-2">Add bank account</button>
      </div>
    </>}

    {section==='Reviews' && <>
      <h1 className="text-4xl font-black">Reviews</h1>
      <div className="mt-6 card p-4">
        <p className="font-bold mb-3">Respond to a review</p>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} className="input w-full h-24 resize-none" placeholder="Write a response or note..."/>
        <button onClick={addReview} className="btn-primary mt-3">Post response</button>
      </div>
      <div className="mt-4 space-y-3">
        {reviews.map(r=>(
          <div key={r.id} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-forest text-white flex items-center justify-center text-xs font-black">{r.author[0]}</div>
              <div>
                <p className="text-sm font-bold">{r.author}</p>
                <p className="text-xs text-slate-400">{r.tour} · {r.date}</p>
              </div>
              <span className="ml-auto text-yellow-500">{'★'.repeat(r.rating)}</span>
            </div>
            <p className="text-sm text-slate-600">{r.text}</p>
          </div>
        ))}
      </div>
    </>}

    {section==='Subscription' && <>
      <h1 className="text-4xl font-black">Subscription</h1>
      <p className="text-slate-500 mt-1">Current plan: <strong>{d.operator.subscription_plan}</strong></p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {['Free','Professional','Enterprise'].map(plan=>(
          <div key={plan} className={`card p-5 ${d.operator.subscription_plan===plan?'border-2 border-forest':''}`}>
            {d.operator.subscription_plan===plan && <span className="rounded-full bg-forest text-white text-xs px-3 py-1 font-bold">Current</span>}
            <p className="text-xl font-black mt-2">{plan}</p>
            <p className="text-3xl font-black mt-1">{plan==='Free'?'$0':plan==='Professional'?'$49':'$149'}<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>✓ {plan==='Free'?'5':plan==='Professional'?'50':'Unlimited'} tours</li>
              <li>✓ {plan==='Free'?'Basic':plan==='Professional'?'Priority':'Dedicated'} support</li>
              {plan!=='Free'&&<li>✓ Analytics dashboard</li>}
              {plan==='Enterprise'&&<li>✓ Custom branding</li>}
            </ul>
            {d.operator.subscription_plan!==plan && <button className="btn-primary mt-4 w-full text-sm py-2">Upgrade</button>}
          </div>
        ))}
      </div>
    </>}
  </DashboardShell>
}