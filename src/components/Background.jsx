import {useEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
export const toast=m=>dispatchEvent(new CustomEvent('homora-toast',{detail:m}));
export default function Background(){
  const dot=useRef(),bar=useRef(),[t,setT]=useState([]);
  useEffect(()=>{
    const mx=gsap.quickTo(dot.current,'x',{duration:.6}),my=gsap.quickTo(dot.current,'y',{duration:.6});
    const mv=e=>{mx(e.clientX-150);my(e.clientY-150)};
    let scrollFrame=0;
    const sc=()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const maxScroll=document.documentElement.scrollHeight-innerHeight,progress=maxScroll>0?Math.min(1,Math.max(0,scrollY/maxScroll)):0;
      if(bar.current){bar.current.style.transform=`scaleX(${progress})`;bar.current.setAttribute('aria-valuenow',String(Math.round(progress*100)))}
      document.querySelectorAll('[data-scroll-depth]').forEach(element=>{const depth=Number(element.dataset.scrollDepth)||0;element.style.setProperty('--scroll-shift',`${Math.max(-36,Math.min(36,-scrollY*depth))}px`)});
    })};
    const rp=e=>{const b=e.target.closest('button,.btn');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span'),d=Math.max(r.width,r.height)*2;
      s.className='ripple';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),700)};
    const ts=e=>{const id=Math.random();setT(x=>[...x,{id,m:e.detail}]);setTimeout(()=>setT(x=>x.filter(i=>i.id!==id)),2300)};
    addEventListener('mousemove',mv);addEventListener('scroll',sc,{passive:true});addEventListener('resize',sc);addEventListener('click',rp);addEventListener('homora-toast',ts);sc();
    return()=>{removeEventListener('mousemove',mv);removeEventListener('scroll',sc);removeEventListener('resize',sc);removeEventListener('click',rp);removeEventListener('homora-toast',ts);if(scrollFrame)cancelAnimationFrame(scrollFrame)};
  },[]);
  return <>
   <div className="gridbg"/><i data-scroll-depth=".035" className="blob h-[500px] w-[500px] bg-[#9fc58a] -left-32 top-10"/><i data-scroll-depth="-.025" className="blob h-[450px] w-[450px] bg-[#4a7c59]/50 right-0 top-1/3" style={{animationDelay:'-6s'}}/><i data-scroll-depth=".02" className="blob h-[400px] w-[400px] bg-[#9bb591] left-1/3 bottom-0" style={{animationDelay:'-11s'}}/>
   <svg data-scroll-depth=".045" className="bgshape left-[6%] top-[16%] w-64" viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M20 140H180M40 140V70H160V140M30 75L100 20L170 75M85 140V105H115V140M55 90h22v22H55zM123 90h22v22h-22z"/></svg><svg data-scroll-depth="-.035" className="bgshape right-[5%] bottom-[10%] w-72" style={{animationDelay:'-14s'}} viewBox="0 0 200 140" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M10 10H190V130H10ZM10 70H110M110 10V130M60 70V130M110 50H190"/></svg><div ref={dot} className="glow"/><div ref={bar} className="sbar" role="progressbar" aria-label="Page scroll progress" aria-valuemin="0" aria-valuemax="100"/><div className="grain"/>
   <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-2" aria-live="polite">{t.map(i=><div key={i.id} className="toast">✓ {i.m}</div>)}</div></>;
}
