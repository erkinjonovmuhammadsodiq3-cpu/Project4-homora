import {Link,useLocation,useNavigate} from 'react-router-dom';
import {useProjects} from '../context/AppContexts';
export default function ProjectBar(){
  const {pathname}=useLocation(),{projects,active,setActive}=useProjects(),nav=useNavigate();
  if(!active||!/^\/(shop|product|cart|compare)/.test(pathname))return null;
  const left=active.budget-active.spent-active.products.reduce((a,x)=>a+x.price,0);
  return <div className="sticky top-16 z-30 border-b border-stone/30 bg-warm/90 backdrop-blur"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2 text-xs">
   <span className="uppercase tracking-widest text-accent">Shopping for</span>
   <select aria-label="Active project" value={active.id} onChange={e=>setActive(e.target.value)} className="rounded-full border border-stone/50 bg-transparent px-3 py-1">{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
   <span>{active.style} · <b className={left<0?'text-accent':''}>${Math.round(left).toLocaleString()}</b> {left<0?'over budget':'left'}</span>
   <Link className="underline underline-offset-4" to={`/shop?style=${active.style}&max=${Math.max(100,Math.round(Math.max(left,0)*.25))}`}>Match my style & budget</Link>
   <Link className="ml-auto underline underline-offset-4" to={'/projects/'+active.id}>Open dashboard →</Link></div></div>;
}
