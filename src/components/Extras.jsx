import {useEffect,useRef,useState,useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {gsap} from 'gsap';
import {FiSearch,FiArrowUp,FiArrowRight,FiMessageCircle,FiX,FiSend} from 'react-icons/fi';
import {products} from '../data/products';
const pages=[['Shop','/shop'],['Deals','/deals'],['Materials calculator','/materials-calculator'],['Build a home','/build'],['Design studio','/design'],['Room planner','/room-scan'],['Architects','/architecture'],['Inspiration','/inspiration'],['Exterior','/exterior'],['Garden & pool','/garden'],['My projects','/projects'],['Compare','/compare'],['Cart','/cart'],['Orders','/orders'],['Favorites','/favorites'],['Settings','/settings']];
export function LoadingScreen(){
  const [show,setShow]=useState(()=>!sessionStorage.getItem('homora-loaded')),ref=useRef();
  useEffect(()=>{if(!show)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){sessionStorage.setItem('homora-loaded','1');setShow(false);return}const tl=gsap.timeline({onComplete:()=>{sessionStorage.setItem('homora-loaded','1');setShow(false)}});
    tl.from('.ld-l',{yPercent:110,opacity:0,stagger:.07,duration:.6,ease:'power4.out'}).from('.ld-line',{scaleX:0,duration:.7,ease:'power2.inOut'},'-=.3')
      .to(ref.current,{yPercent:-100,duration:.8,ease:'power4.inOut',delay:.25});return()=>tl.kill()},[show]);
  if(!show)return null;
  return <div ref={ref} className="fixed inset-0 z-[200] grid place-items-center bg-[#17201a] text-[#eef3e8]"><div className="text-center"><div className="flex overflow-hidden font-display text-5xl tracking-[.3em] md:text-7xl">{'HOMORA'.split('').map((c,i)=><span key={i} className="ld-l inline-block">{c}</span>)}</div>
   <div className="ld-line mx-auto mt-5 h-px origin-left bg-[#4a7c59]"/><p className="mt-3 text-[10px] uppercase tracking-[.4em] text-[#b7c4b3]">From an empty plot to your dream home</p></div></div>;
}
export function SearchOverlay(){
  const [open,setOpen]=useState(false),[q,setQ]=useState(''),[sel,setSel]=useState(0),inp=useRef(),box=useRef(),previousFocus=useRef(),nav=useNavigate();
  useEffect(()=>{const k=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setOpen(o=>!o)}if(e.key==='Escape')setOpen(false)};
    const o=()=>setOpen(true);addEventListener('keydown',k);addEventListener('homora-search',o);return()=>{removeEventListener('keydown',k);removeEventListener('homora-search',o)}},[]);
  useEffect(()=>{if(!open)return;previousFocus.current=document.activeElement;const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';setQ('');setSel(0);
    const focusTimer=setTimeout(()=>inp.current?.focus(),50);if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&box.current)gsap.fromTo(box.current,{y:-30,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:.4,ease:'power3.out'});
    return()=>{clearTimeout(focusTimer);document.body.style.overflow=previousOverflow;previousFocus.current?.focus?.()}},[open]);
  const res=useMemo(()=>{const s=q.trim().toLowerCase();if(!s)return pages.slice(0,6).map(([n,p])=>({t:n,s:'Page',to:p}));
    const matchingPages=pages.filter(([name,path])=>`${name} ${path}`.toLowerCase().includes(s)).map(([name,path])=>({t:name,s:'Page',to:path}));
    const matchingProducts=products.filter(p=>`${p.name} ${p.category} ${p.brand||''} ${p.style} ${p.material||''} ${p.description||''}`.toLowerCase().includes(s))
      .sort((a,b)=>Number(b.name.toLowerCase().startsWith(s))-Number(a.name.toLowerCase().startsWith(s))).slice(0,7)
      .map(p=>({t:p.name,s:`${p.category} · $${p.price}`,to:`/product/${p.id}`,img:p.image}));
    return [...matchingPages,...matchingProducts]},[q]);
  useEffect(()=>{if(open)gsap.fromTo('.so-r',{x:-12,opacity:0},{x:0,opacity:1,stagger:.03,duration:.3})},[res,open]);
  const go=r=>{if(r){nav(r.to);setOpen(false)}};
  if(!open)return null;
  return <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&setOpen(false)} role="dialog" aria-modal="true" aria-label="Search" onKeyDown={e=>{if(e.key!=='Tab'||!box.current)return;const focusable=box.current.querySelectorAll('input:not([disabled]),button:not([disabled]),a[href]');if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}>
   <div ref={box} className="so-box card mx-auto max-w-2xl !bg-warm p-0 shadow-2xl"><div className="flex items-center gap-3 border-b border-stone/40 px-5 py-4"><FiSearch/><input ref={inp} role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="homora-search-results" aria-activedescendant={res.length?`homora-search-result-${sel}`:undefined} value={q} onChange={e=>{setQ(e.target.value);setSel(0)}} placeholder="Search products, pages…  (Ctrl+K)"
     onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setSel(s=>Math.min(s+1,Math.max(0,res.length-1)))}if(e.key==='ArrowUp'){e.preventDefault();setSel(s=>Math.max(s-1,0))}if(e.key==='Enter'){e.preventDefault();go(res[sel])}}} className="w-full bg-transparent text-lg outline-none"/><kbd className="rounded border border-stone/50 px-2 text-xs">Esc</kbd></div>
    <ul id="homora-search-results" role="listbox" aria-label="Search results" className="max-h-[50vh] overflow-auto p-2">{res.map((r,i)=><li id={`homora-search-result-${i}`} role="option" aria-selected={i===sel} key={r.to+i} className="so-r"><button tabIndex={-1} onClick={()=>go(r)} onMouseEnter={()=>setSel(i)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${i===sel?'bg-beige/70':'hover:bg-beige/40'}`}>
      {r.img?<img src={r.img} alt="" className="h-10 w-10 rounded-lg object-cover"/>:<span className="grid h-10 w-10 place-items-center rounded-lg bg-beige"><FiArrowRight/></span>}<span className="flex-1">{r.t}<small className="block text-xs text-stone">{r.s}</small></span></button></li>)}
     {!res.length&&<li className="p-6 text-center text-stone">No results for “{q}”.</li>}</ul></div></div>;
}
export function BackToTop(){
  const [v,setV]=useState(false);
  useEffect(()=>{const f=()=>setV(scrollY>600);addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);
  return <button aria-label="Back to top" onClick={()=>scrollTo({top:0,behavior:'smooth'})} className={`btn btn-dark fixed bottom-6 left-6 z-50 !h-12 !w-12 !rounded-full !p-0 transition-all ${v?'opacity-100':'pointer-events-none translate-y-6 opacity-0'}`}><FiArrowUp/></button>;
}
export function SupportWidget(){
  const [open,setOpen]=useState(false),[message,setMessage]=useState('');
  const [messages,setMessages]=useState(()=>{try{return JSON.parse(localStorage.getItem('homora-support-chat')||'[]')}catch{return []}});
  const input=useRef();
  useEffect(()=>{const close=event=>event.key==='Escape'&&setOpen(false);addEventListener('keydown',close);return()=>removeEventListener('keydown',close)},[]);
  useEffect(()=>{if(open)input.current?.focus()},[open]);
  const send=event=>{event.preventDefault();const text=message.trim();if(!text)return;const lower=text.toLowerCase();
    const answer=lower.includes('order')||lower.includes('buyurt')?'Order history and demo tracking are available on the Orders page. This prototype does not receive live courier updates.':lower.includes('delivery')||lower.includes('yetkaz')?'Standard delivery is free over $300; express delivery costs $39. Delivery estimates are demo-only.':'Thanks for your message. This demo assistant cannot connect you to a live agent. Email support@homora.example for help.';
    const next=[...messages,{from:'you',text},{from:'assistant',text:answer}].slice(-20);setMessages(next);localStorage.setItem('homora-support-chat',JSON.stringify(next));setMessage()};
  return <div className="fixed bottom-6 right-6 z-[80]">
    {open&&<section role="dialog" aria-label="HOMORA demo support" aria-modal="false" className="mb-3 flex h-[min(480px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-stone/40 bg-warm text-char shadow-2xl">
      <header className="flex items-center justify-between bg-char px-4 py-3 text-warm"><div><p className="text-sm font-medium">HOMORA support</p><p className="text-[10px] text-warm/70">Automated demo · not live chat</p></div><button onClick={()=>setOpen(false)} aria-label="Close support chat"><FiX/></button></header>
      <div className="flex-1 space-y-3 overflow-auto p-4" aria-live="polite"><p className="rounded-xl bg-beige p-3 text-xs">Hello! Ask about delivery or order tracking, or contact our demo support email.</p>{messages.map((item,index)=><p key={index} className={`max-w-[88%] whitespace-pre-wrap rounded-xl p-3 text-xs ${item.from==='you'?'ml-auto bg-char text-warm':'bg-beige'}`}>{item.text}</p>)}</div>
      <form onSubmit={send} className="flex gap-2 border-t border-stone/40 p-3"><input ref={input} value={message} onChange={event=>setMessage(event.target.value)} maxLength={300} aria-label="Message support" placeholder="Write a message…" className="min-w-0 flex-1 rounded-lg border border-stone/50 bg-transparent px-3 py-2 text-xs"/><button className="btn btn-dark !h-10 !w-10 !p-0" aria-label="Send message"><FiSend/></button></form>
      <a className="px-4 pb-3 text-[10px] text-stone underline" href="mailto:support@homora.example">Email support</a>
    </section>}
    <button onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-label={open?'Close support':'Open HOMORA support'} className="btn btn-dark ml-auto flex !h-14 !w-14 !rounded-full !p-0 shadow-xl">{open?<FiX/>:<FiMessageCircle/>}</button>
  </div>;
}
