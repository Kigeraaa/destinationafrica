'use client';
export const dynamic = 'force-dynamic';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import {Header} from '@/components/Header';

const FALLBACK='https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=60';

export default function Guides(){
  const [guides,setGuides]=useState<any[]>([]);
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:8000';
    fetch(API+'/guides?limit=50',{cache:'no-store'})
      .then(r=>r.ok?r.json():[])
      .then(data=>setGuides(Array.isArray(data)?data:data?.items||[]))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[]);

  const filtered=guides.filter(g=>
    g.title?.toLowerCase().includes(search.toLowerCase())||
    g.summary?.toLowerCase().includes(search.toLowerCase())
  );

  return <>
    <Header/>
    <main className="section">
      <h1 className="text-4xl font-black">Travel Guides</h1>
      <p className="text-slate-500 mt-2">{guides.length} guides to help plan your trip</p>
      <input className="input mt-6 w-full max-w-sm" placeholder="Search guides..." value={search} onChange={e=>setSearch(e.target.value)}/>
      {loading && <div className="mt-10 text-center text-slate-400">Loading guides...</div>}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {filtered.map((g:any)=>(
          <Link key={g.id} href={`/guides/${g.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow">
            <img src={g.image_url||FALLBACK} alt={g.title} className="h-40 w-full object-cover"
              onError={(e:any)=>{e.target.src=FALLBACK}}/>
            <div className="p-5">
              <p className="font-black">{g.title}</p>
              <p className="text-sm text-slate-500 mt-1">{g.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  </>;
}