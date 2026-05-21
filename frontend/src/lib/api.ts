const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:8000';
export const api={
 async get(path:string){const r=await fetch(API+path,{cache:'no-store'}); if(!r.ok) throw new Error(await r.text()); return r.json()},
 async post(path:string,body:any,token?:string){const r=await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)}); if(!r.ok) throw new Error(await r.text()); return r.json()},
 login:(email:string,password:string)=>api.post('/auth/login',{email,password}),
 register:(body:any)=>api.post('/auth/register',body)
};
export function auth(){ if(typeof window==='undefined') return null; return JSON.parse(localStorage.getItem('da_auth')||'null')}
export function saveAuth(x:any){ localStorage.setItem('da_auth',JSON.stringify(x)); }
