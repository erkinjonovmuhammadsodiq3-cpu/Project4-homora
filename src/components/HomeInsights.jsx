import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {products} from '../data/products';
import {useProjects} from '../context/AppContexts';
import {toast} from './Background';
const avg=(a,k,d)=>a.length?Math.round(a.reduce((s,x)=>s+(x[k]??d),0)/a.length):d;
export function scoreOf(p){
  const u=p.budget?p.spent/p.budget:0;
  const budget=u<=1?Math.round(100-Math.abs(.85-u)*60):Math.max(30,Math.round(100-(u-1)*150));
  const eco=(p.features||[]).includes('Smart Home')?8:0;
  const s={Budget:budget,Style:avg(p.products,'styleMatch',88),Space:avg(p.products,'compat',86),Energy:Math.min(98,72+eco+(p.style==='Eco'?12:0)),Quality:Math.round((p.products.length?p.products.reduce((a,x)=>a+(x.rating||4.5),0)/p.products.length:4.5)*20)};
  return {...s,total:Math.round(Object.values(s).reduce((a,b)=>a+b,0)/5)};
}
export default function HomeInsights({p}){
  const sc=scoreOf(p),ref=useRef(),{dispatch}=useProjects();
  useEffect(()=>{const o={v:0},n=ref.current.querySelector('.hs-n'),r=ref.current.querySelector('.hs-r');
    gsap.to(o,{v:sc.total,duration:1.5,ease:'power3.out',onUpdate:()=>{n.textContent=Math.round(o.v);r.style.strokeDashoffset=339*(1-o.v/100)}});
    gsap.fromTo(ref.current.querySelectorAll('.hs-b'),{scaleX:0},{scaleX:1,stagger:.1,duration:.9,ease:'power3.out'})},[sc.total]);
  const alts=p.products.map(x=>{const c=products.filter(y=>y.category===x.category&&y.id!==x.id&&y.price<x.price&&(y.rating||0)>=(x.rating||0)-.3).sort((a,b)=>b.rating-a.rating)[0];return c&&{from:x,to:c}}).filter(Boolean);
  return <section ref={ref} className="my-10 grid gap-6 md:grid-cols-2">
   <div className="card"><p className="text-[10px] uppercase tracking-[.2em] text-accent">Home score</p>
    <div className="mt-3 flex items-center gap-6"><div className="relative h-32 w-32"><svg viewBox="0 0 120 120" className="-rotate-90"><circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="8"/><circle className="hs-r" cx="60" cy="60" r="54" fill="none" stroke="#4a7c59" strokeWidth="8" strokeLinecap="round" strokeDasharray="339" strokeDashoffset="339"/></svg>
     <p className="absolute inset-0 grid place-items-center font-display text-4xl"><span className="hs-n">0</span></p></div>
     <div className="flex-1 space-y-2">{['Budget','Style','Space','Energy','Quality'].map(k=><div key={k}><div className="flex justify-between text-xs"><span>{k}</span><span>{sc[k]}</span></div><div className="h-1.5 rounded bg-beige"><div className="hs-b h-full origin-left rounded bg-accent" style={{width:sc[k]+'%'}}/></div></div>)}</div></div></div>
   <div className="card"><p className="text-[10px] uppercase tracking-[.2em] text-accent">Smart alternatives</p>
    {alts.length?alts.slice(0,3).map(({from,to})=><div key={from.id} className="mt-3 flex items-center gap-3 border-b border-stone/30 pb-3 text-sm"><img src={to.image} alt="" className="h-12 w-12 rounded-lg object-cover"/>
     <div className="flex-1"><p>{to.name} <span className="text-stone">instead of {from.name}</span></p><p className="text-green-700">You can save ${from.price-to.price} · ★ {to.rating}</p></div>
     <button className="btn !px-3 !py-2" onClick={()=>{dispatch({type:'REMOVE_PRODUCT_FROM_PROJECT',id:p.id,payload:from.id});dispatch({type:'ADD_PRODUCT_TO_PROJECT',id:p.id,payload:to});toast(`Saved $${from.price-to.price}`)}}>Swap</button></div>)
     :<p className="mt-4 text-sm text-stone">Add products to this project — we'll suggest cheaper options of similar quality.</p>}</div></section>;
}
