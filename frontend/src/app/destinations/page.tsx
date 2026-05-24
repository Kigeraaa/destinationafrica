'use client';
export const dynamic = 'force-dynamic';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import {Header} from '@/components/Header';

const FALLBACK='https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=60';

function fixName(name:string){
  return name==='Cabo Verde'?'Cape Verde':name;
}

export default function Destinations(){
  const [countries,setCountries]=useState<any[]>([]);
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:8000';
    fetch(API+'/countries',{cache:'no-store'})
      .then(r=>r.ok?r.json():[])
      .then(data=>setCountries(Array.isArray(data)?data:data?.items||[]))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[]);

  const filtered=countries.filter(c=>fixName(c.name).toLowerCase().includes(search.toLowerCase()));

  return <>
    <Header/>
    <main className="section">
      <h1 className="text-4xl font-black">African Destinations</h1>
      <p className="text-slate-500 mt-2">{countries.length} countries across Africa</p>
      <input className="input mt-6 w-full max-w-sm" placeholder="Search destinations..." value={search} onChange={e=>setSearch(e.target.value)}/>
      {loading && <div className="mt-10 text-center text-slate-400">Loading destinations...</div>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {filtered.map((c:any)=>(
          <Link key={c.id} href={`/destinations/${c.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow">
            <img src={c.image_url||FALLBACK} alt={fixName(c.name)} className="h-36 w-full object-cover"
              onError={(e:any)=>{e.target.src=FALLBACK}}/>
            <div className="p-4">
              <p className="font-black">{fixName(c.name)}</p>
              {c.region && <p className="text-xs text-slate-500 mt-1">{c.region}</p>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  </>;
}