import {useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowRight,FiPlus,FiCompass,FiTool,FiLayers,FiSun} from 'react-icons/fi';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
import {products,styles} from '../data/products';
import {useProjects} from '../context/AppContexts';

const copy={
  Modern:'Quiet lines, tactile materials and practical pieces that make daily life feel lighter.',
  Minimalist:'A little less, chosen with care. Clear surfaces and useful forms.',
  Classic:'Warm woods, familiar silhouettes and details that hold their character.',
  Luxury:'Expressive materials and considered statement pieces, balanced by restraint.',
  Scandinavian:'Natural textures, soft light and honest materials for everyday comfort.',
  Industrial:'Strong forms, durable finishes and purposeful utility.',
  Eco:'Lower-impact materials, long-lived products and a closer connection to nature.',
  Traditional:'Craft, pattern and familiar forms with room for a modern home.'
};

export function Inspiration(){
  const root=useRef(null),[activeStyle,setActiveStyle]=useState('All');
  const boards=useMemo(()=>styles.filter(style=>activeStyle==='All'||style===activeStyle).map((style,index)=>{
    const items=products.filter(product=>product.style===style).slice(0,3);
    return {style,items,hero:items[0]||products[index]};
  }),[activeStyle]);
  useGSAP(()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo('.inspiration-card',{y:20,opacity:0},{y:0,opacity:1,stagger:.07,duration:.55,ease:'power2.out'})},{scope:root,dependencies:[boards]});
  return <div ref={root} className="mx-auto max-w-7xl px-5 py-10 md:py-14">
    <section className="grid gap-8 border-b border-stone/50 pb-8 md:grid-cols-[1fr_.7fr] md:items-end"><div><p className="text-[10px] uppercase tracking-[.2em] text-accent">HOMORA EDITIONS</p><h1 className="mt-3 font-display text-5xl md:text-7xl">Ideas you can bring home.</h1></div><p className="max-w-lg text-sm leading-6 text-stone">Explore room directions, see the products behind each look and move straight from inspiration to the shop.</p></section>
    <div className="my-7 flex gap-2 overflow-x-auto pb-2" aria-label="Filter inspiration by style">{['All',...styles].map(style=><button key={style} onClick={()=>setActiveStyle(style)} aria-pressed={activeStyle===style} className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${activeStyle===style?'border-char bg-char text-warm':'border-stone/60 hover:border-char'}`}>{style}</button>)}</div>
    <div className="grid gap-5 md:grid-cols-2">{boards.map(({style,items,hero})=><article key={style} className="inspiration-card group overflow-hidden border border-stone/40"><Link to={`/shop?style=${encodeURIComponent(style)}`} className="relative block overflow-hidden"><img src={hero.image} alt={`${style} room inspiration`} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03]"/><span className="absolute left-4 top-4 border border-white/70 bg-char/45 px-3 py-2 text-[9px] uppercase tracking-[.18em] text-white backdrop-blur">STYLE STUDY 0{styles.indexOf(style)+1}</span><span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-warm text-char transition group-hover:translate-x-1"><FiArrowRight/></span></Link><div className="p-5 md:p-7"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-3xl">{style}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-stone">{copy[style]}</p></div><span className="text-xs text-stone">0{styles.indexOf(style)+1}</span></div><div className="mt-5 flex flex-wrap gap-2">{items.map(product=><Link key={product.id} to={`/product/${product.id}`} className="border border-stone/40 px-3 py-2 text-xs transition hover:border-char">{product.name} · ${product.price}</Link>)}</div><Link to={`/shop?style=${encodeURIComponent(style)}`} className="mt-5 inline-flex items-center text-xs uppercase tracking-widest">Shop this style <FiArrowRight className="ml-2"/></Link></div></article>)}</div>
    <section className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-stone/50 pt-7"><div><p className="text-[10px] uppercase tracking-[.2em] text-accent">Have your own direction?</p><h2 className="mt-2 font-display text-3xl">Make a room plan around it.</h2></div><Link to="/design" className="btn btn-dark">Design my space <FiArrowRight className="ml-2"/></Link></section>
  </div>;
}

const services=[
  ['Architectural design','Concepts, floor plans and elevations shaped around your land and brief.','From $1,200',FiCompass,'photo-1503387762-592deb58ef4e'],
  ['Structural engineering','Foundation, framing and roof planning for your build.','From $850',FiTool,'photo-1504307651254-35680f356dfd'],
  ['Interior planning','Room layouts, finish schedules and product selections.','From $450',FiLayers,'photo-1600210492486-724fe5c67fb0'],
  ['Exterior & landscape','Facade, garden, terrace and pool concepts.','From $600',FiSun,'photo-1466692476868-aef1dfb1e735']
];

export function ArchitectureHub(){
  const {projects,dispatch}=useProjects();
  const [message,setMessage]=useState(''),[request,setRequest]=useState({name:'',phone:'',service:services[0][0],details:''}),[requests,setRequests]=useState(()=>{try{return JSON.parse(localStorage.getItem('homora-service-requests')||'[]')}catch{return []}});
  const addService=name=>{
    if(!projects.length){setMessage('Create a home project first to attach this service.');return}
    const project=projects[0],selected=[...(project.services||[])];
    if(!selected.includes(name))selected.push(name);
    dispatch({type:'UPDATE_PROJECT',id:project.id,payload:{services:selected}});
    setMessage(`${name} added to ${project.name}.`);
  };
  const requestQuote=event=>{event.preventDefault();const entry={...request,id:`SR-${Date.now().toString().slice(-6)}`,createdAt:new Date().toISOString(),status:'Saved on this device — demo'};const next=[entry,...requests];setRequests(next);localStorage.setItem('homora-service-requests',JSON.stringify(next));setMessage(`Request for ${request.service} saved locally. No provider has been contacted.`);setRequest(current=>({...current,name:'',phone:'',details:''}))};
  return <div className="mx-auto max-w-7xl px-5 py-12">
    <section className="grid gap-8 bg-char p-7 text-warm md:grid-cols-[1fr_.7fr] md:items-end md:p-12"><div><p className="text-[10px] uppercase tracking-[.2em] text-beige">ARCHITECTURE & HOME SERVICES</p><h1 className="mt-3 font-display text-5xl md:text-7xl">A good build starts with a clear plan.</h1></div><p className="text-sm leading-6 text-warm/75">Explore sample services for every stage, from the first floor plan to a finished garden. Add selections to your project brief.</p></section>
    <div className="mt-9 grid gap-5 md:grid-cols-2">{services.map(([name,description,price,Icon,image],index)=><article key={name} className="overflow-hidden rounded-[30px] border border-stone/50 bg-[#f3efe8] shadow-[0_18px_50px_rgba(30,30,26,0.04)]"><img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=1400&q=84`} alt={`${name} service`} loading="lazy" className="aspect-[16/9] w-full object-cover"/><div className="px-6 pb-5 pt-6 md:px-8 md:pb-7 md:pt-7"><div className="flex items-start justify-between gap-5"><div className="flex min-w-0 items-center gap-2 text-[10px] uppercase tracking-[.28em] text-accent"><Icon aria-hidden="true" className="text-base"/><span>SERVICE 0{index+1}</span></div><button onClick={()=>addService(name)} className="shrink-0 rounded-full border-[1.5px] border-[#2e2d2a] bg-transparent px-5 py-3 text-[10px] uppercase tracking-[.22em] text-char transition hover:bg-char hover:text-warm">ADD TO PROJECT <FiPlus className="ml-2 inline"/></button></div><div className="mt-5 md:mt-6"><h2 className="font-display text-[3.2rem] leading-[.85] tracking-[-.04em] text-char md:text-[4.5rem]">{name}</h2><p className="mt-4 max-w-xl text-base leading-7 text-char/75 md:text-lg">{description}</p></div>    <div className="mt-7 flex items-center justify-between gap-3 border-t border-stone/40 pt-4"><span className="text-[2rem] leading-none tracking-[-.04em] text-char md:text-[2.2rem]">From {price.replace(/^From\s+/, '').replace(/\s+estimate$/i, '')} <span className="ml-2 text-[10px] uppercase tracking-[.18em] text-stone">ESTIMATE</span></span><span className="text-[10px] uppercase tracking-[.2em] text-char/75">DESIGN CONSULT</span></div></div></article>)}</div>    {message&&<p role="status" className="mt-5 border-l-2 border-accent px-4 py-3 text-sm">{message}</p>}
    <section className="mt-12 grid gap-8 border-t border-stone/40 pt-8 md:grid-cols-[.8fr_1.2fr]"><div><p className="text-[10px] uppercase tracking-[.2em] text-accent">DEMO REQUEST FORM</p><h2 className="mt-2 font-display text-3xl">Ask for a service quote.</h2><p className="mt-2 text-sm leading-6 text-stone">Save a local brief to review with a provider. This prototype does not send messages or book a contractor.</p><form onSubmit={requestQuote} className="mt-5 grid gap-3"><label className="grid gap-2 text-xs">Service<select value={request.service} onChange={event=>setRequest(current=>({...current,service:event.target.value}))} className="auth-input">{services.map(([name])=><option key={name}>{name}</option>)}</select></label><label className="grid gap-2 text-xs">Your name<input required value={request.name} onChange={event=>setRequest(current=>({...current,name:event.target.value}))} className="auth-input"/></label><label className="grid gap-2 text-xs">Phone or email<input required value={request.phone} onChange={event=>setRequest(current=>({...current,phone:event.target.value}))} className="auth-input"/></label><label className="grid gap-2 text-xs">Project brief<textarea maxLength="500" value={request.details} onChange={event=>setRequest(current=>({...current,details:event.target.value}))} className="auth-input" placeholder="Location, area, preferred timing…"/></label><button className="btn btn-dark w-fit">Save quote request</button></form></div><div><h3 className="font-display text-2xl">Saved requests</h3>{requests.length?<div className="mt-4 divide-y divide-stone/30 border-y border-stone/40">{requests.map(item=><article key={item.id} className="py-4"><p className="font-medium">{item.service}</p><p className="mt-1 text-xs text-stone">{item.name} · {item.phone} · {new Date(item.createdAt).toLocaleDateString()}</p>{item.details&&<p className="mt-2 text-sm">{item.details}</p>}<p className="mt-2 text-[10px] text-accent">{item.status}</p></article>)}</div>:<p className="mt-3 text-sm text-stone">Your locally saved requests will appear here.</p>}</div></section>
    <section className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-stone/50 pt-7"><div><p className="text-xs text-stone">Not started yet?</p><h2 className="mt-1 font-display text-3xl">Build your project brief first.</h2></div><Link to="/build" className="btn btn-dark">Start a home plan <FiArrowRight className="ml-2"/></Link></section>
  </div>;
}
