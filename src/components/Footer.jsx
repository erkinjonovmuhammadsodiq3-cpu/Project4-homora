import {useState} from 'react';
import {Link} from 'react-router-dom';
import {FaInstagram,FaTelegramPlane,FaYoutube,FaFacebookF} from 'react-icons/fa';
import {FiArrowUpRight,FiCheck} from 'react-icons/fi';
import {toast} from './Background';
const cols=[['Explore',[['Shop all','/shop'],['Design a space','/design'],['Build a home','/build'],['Inspiration','/inspiration']]],
 ['Build & design',[['Architects','/architecture'],['Exterior','/exterior'],['Garden & pool','/garden'],['Room planner','/room-scan']]],
 ['Your HOMORA',[['Profile','/account'],['My projects','/projects'],['Orders','/orders'],['Favorites','/favorites'],['Cart','/cart']]]];
const tags=['Furniture','Lighting','Kitchen','Bathroom','Smart Home','Garden','Pool','Tools','Flooring','Windows & Doors','Electrical','Decor'];
export default function Footer(){
  const [mail,setMail]=useState(''),[ok,setOk]=useState(false);
  const sub=e=>{e.preventDefault();setOk(true);toast('Subscribed — welcome to HOMORA!');setMail('')};
  return <footer className="site-footer relative mt-24 overflow-hidden bg-char text-warm">
   <div className="border-b border-warm/15 py-4"><div className="marquee">{[...tags,...tags,...tags,...tags].map((t,i)=><Link key={i} to={`/shop?q=${t}`} className="mx-6 text-xs uppercase tracking-[.25em] text-warm/60 transition hover:text-[#9fc58a]">✦ {t}</Link>)}</div></div>
   <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
    <div><p className="font-display text-3xl tracking-[.24em]">HOMORA</p><p className="mt-4 max-w-xs text-sm leading-6 text-warm/65">From the first foundation line to the final detail — plan, shop and track your whole home in one place.</p>
     <form onSubmit={sub} className="mt-6 flex max-w-sm overflow-hidden rounded-full border border-warm/30 transition focus-within:border-[#9fc58a]"><input required type="email" value={mail} onChange={e=>setMail(e.target.value)} placeholder="Your email for offers" aria-label="Email" className="w-full bg-transparent px-5 py-3 text-sm outline-none placeholder:text-warm/40"/>
      <button className="btn m-1 !border-0 !bg-[#4a7c59] !px-4 !py-2 !text-warm" aria-label="Subscribe">{ok?<FiCheck/>:<FiArrowUpRight/>}</button></form>
     <div className="mt-6 flex gap-3">{[FaInstagram,FaTelegramPlane,FaYoutube,FaFacebookF].map((I,i)=><a key={i} href="#" aria-label="Social" className="grid h-10 w-10 place-items-center rounded-full border border-warm/25 transition hover:-translate-y-1 hover:border-[#9fc58a] hover:bg-[#9fc58a] hover:text-[#17201a]"><I/></a>)}</div></div>
    {cols.map(([h,l])=><div key={h}><h2 className="text-[10px] uppercase tracking-[.25em] text-[#9fc58a]">{h}</h2><div className="mt-5 grid gap-3 text-sm text-warm/75">{l.map(([n,p])=><Link key={p} to={p} className="foot-link w-fit">{n}</Link>)}</div></div>)}</div>
   <p className="foot-word select-none text-center font-display leading-none" aria-hidden="true">{'HOMORA'.split('').map((c,i)=><span key={i}>{c}</span>)}</p>
   <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-warm/15 px-5 py-5 text-[11px] text-warm/50"><span>© {new Date().getFullYear()} HOMORA · Prototype marketplace</span><span className="flex gap-2">{['VISA','Mastercard','Click','Payme','Cash'].map(p=><b key={p} className="rounded border border-warm/25 px-2 py-0.5 font-normal">{p}</b>)}</span><button onClick={()=>scrollTo({top:0,behavior:'smooth'})} className="foot-link">Back to top ↑</button></div></footer>;
}
