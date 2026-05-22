import {Header} from '@/components/Header';
import {notFound} from 'next/navigation';

export default async function Guide({params}:any){
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let g:any = null;
  try {
    const r = await fetch(API+'/guides/'+params.slug, {cache:'no-store'});
    if (r.ok) g = await r.json();
  } catch {}
  if (!g) return notFound();
  return (
    <><Header/>
    <main className="section max-w-4xl">
      <img src={g.image_url} className="h-80 w-full rounded-3xl object-cover"/>
      <h1 className="mt-6 text-4xl font-black">{g.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{g.summary}</p>
      <article className="card mt-6 p-8 leading-8">{g.content}</article>
    </main></>
  );
}