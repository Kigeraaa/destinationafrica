import {Header} from '@/components/Header';
import {TourCard} from '@/components/TourCard';

export default async function Tours({searchParams}:any){
  const p = await searchParams;
  const qs = new URLSearchParams(p).toString();
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let data = {items:[], total:0}, countries:any[] = [], cats:any[] = [];
  try {
    [data, countries, cats] = await Promise.all([
      fetch(API+'/tours?limit=100&'+qs,{cache:'no-store'}).then(r=>r.ok?r.json():{items:[],total:0}),
      fetch(API+'/countries',{cache:'no-store'}).then(r=>r.ok?r.json():[]),
      fetch(API+'/categories',{cache:'no-store'}).then(r=>r.ok?r.json():[]),
    ]);
  } catch {}
  return (
    <><Header/>
    <main className="section">
      <h1 className="text-4xl font-black">Tours & Experiences</h1>
      <form className="card mt-6 grid gap-3 p-4 md:grid-cols-5">
        <input name="q" defaultValue={p.q||''} className="input" placeholder="Keyword"/>
        <select name="country" className="input">
          <option value="">All countries</option>
          {countries.map((c:any)=><option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select name="category" className="input">
          <option value="">All categories</option>
          {cats.map((c:any)=><option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <input name="max_price" className="input" placeholder="Max price"/>
        <button className="btn-primary">Filter</button>
      </form>
      <p className="mt-4 text-sm text-slate-500">Showing {data.total} experiences</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((t:any)=><TourCard key={t.id} tour={t}/>)}
      </div>
    </main></>
  );
}