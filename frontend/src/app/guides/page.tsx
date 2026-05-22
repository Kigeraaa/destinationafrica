import Link from 'next/link';
import {Header} from '@/components/Header';

export default async function Guides({searchParams}:any){
  const p = await searchParams;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let guides:any[] = [];
  try { guides = await fetch(API+'/guides?limit=50&'+new URLSearchParams(p).toString(),{cache:'no-store'}).then(r=>r.ok?r.json():[]); } catch {}
  return (
    <><Header/>
    <main className="section">
      <h1 className="text-4xl font-black">Travel Guides</h1>
      <form className="card mt-6 flex gap-3 p-4">
        <input name="q" className="input" placeholder="Search guides"/>
        <button className="btn-primary">Filter</button>
      </form>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {guides.map((g:any)=>(
          <Link key={g.id} href={`/guides/${g.slug}`} className="card overflow-hidden">
            <img src={g.image_url} className="h-40 w-full object-cover"/>
            <div className="p-5"><b>{g.title}</b><p className="text-sm text-slate-500">{g.summary}</p></div>
          </Link>
        ))}
      </div>
    </main></>
  );
}