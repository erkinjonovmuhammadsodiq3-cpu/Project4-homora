import {useState,useMemo,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {gsap} from 'gsap';
import ProductCard from '../components/ProductCard';
import {products,categories,styles} from '../data/products';
const info=['Free delivery over $500','30-day returns','Secure payment','Installation service','24/7 support'];
export function Shop(){
  const {category}=useParams();
  const [q,setQ]=useState(''),[cat,setCat]=useState(category||'All'),[style,setStyle]=useState('All'),[max,setMax]=useState(1000),[sort,setSort]=useState(''),[rate,setRate]=useState(0);
  useEffect(()=>{setCat(category||'All')},[category]);
  const list=useMemo(()=>{let l=products.filter(p=>(cat==='All'||p.category===cat)&&(style==='All'||p.style===style)&&p.price<=max&&p.rating>=rate&&p.name.toLowerCase().includes(q.toLowerCase()));
    if(sort==='low')l=[...l].sort((a,b)=>a.price-b.price);if(sort==='high')l=[...l].sort((a,b)=>b.price-a.price);if(sort==='rating')l=[...l].sort((a,b)=>b.rating-a.rating);return l},[q,cat,style,max,sort,rate]);
  useEffect(()=>{gsap.fromTo('.pc',{y:40,opacity:0},{y:0,opacity:1,stagger:.05,duration:.6,ease:'power3.out',clearProps:'opacity'})},[list]);
  const recent=JSON.parse(localStorage.getItem('homora-recent')||'[]').map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const sel="rounded-full border border-stone/60 bg-white/70 px-4 py-2 outline-none focus:border-accent";
  return <div className="mx-auto max-w-7xl px-5 py-10">
   <div className="overflow-hidden rounded-3xl bg-char py-3 text-warm"><div className="marquee">{[...info,...info,...info,...info].map((t,i)=><span key={i} className="mx-8 text-xs uppercase tracking-widest">✦ {t}</span>)}</div></div>
   <h1 className="shine-text mt-10 font-display text-5xl md:text-8xl">Shop everything<br/>for your home.</h1>
   <div className="sticky top-16 z-30 -mx-2 mt-8 rounded-2xl bg-warm/80 p-3 backdrop-blur"><div className="flex gap-2 overflow-x-auto pb-3">{['All',...categories].map(c=><button key={c} className={`chip ${cat===c?'on':''}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
    <div className="flex flex-wrap items-center gap-3"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products…" aria-label="Search" className={sel+' min-w-[200px] flex-1'}/>
     <select className={sel} aria-label="Style" value={style} onChange={e=>setStyle(e.target.value)}><option>All</option>{styles.map(s=><option key={s}>{s}</option>)}</select>
     <select className={sel} aria-label="Rating" value={rate} onChange={e=>setRate(+e.target.value)}><option value={0}>Any rating</option><option value={4.5}>4.5+ ★</option><option value={4.7}>4.7+ ★</option></select>
     <label className="flex items-center gap-2 text-sm">≤ ${max}<input type="range" min="10" max="1000" value={max} onChange={e=>setMax(+e.target.value)} className="accent-[#4a7c59]"/></label>
     <select className={sel} aria-label="Sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="">Sort: Featured</option><option value="low">Price ↑</option><option value="high">Price ↓</option><option value="rating">Top rated</option></select></div></div>
   <p className="my-5 text-sm text-stone">{list.length} products</p>
   {list.length?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<p className="py-20 text-center font-display text-3xl">Nothing found — try other filters.</p>}
   {recent.length>0&&<><h2 className="mb-4 mt-16 font-display text-3xl">Recently viewed</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{recent.map(p=><ProductCard key={'r'+p.id} p={p}/>)}</div></>}</div>;
}
