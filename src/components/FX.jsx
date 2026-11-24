import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';
export default function FX(){
  const ring=useRef();
  useEffect(()=>{
    if(matchMedia('(pointer:coarse)').matches)return;
    const x=gsap.quickTo(ring.current,'x',{duration:.35,ease:'power3'}),y=gsap.quickTo(ring.current,'y',{duration:.35,ease:'power3'});
    const mv=e=>{x(e.clientX);y(e.clientY);const t=e.target.closest?.('a,button,.btn,input,select,textarea');ring.current.classList.toggle('cur-big',!!t);ring.current.style.opacity=1;
      const b=e.target.closest?.('.btn');if(b){const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.28,duration:.3})}};
    const out=e=>{const b=e.target.closest?.('.btn');if(b&&!b.contains(e.relatedTarget))gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'})};
    addEventListener('mousemove',mv);addEventListener('mouseout',out);
    return()=>{removeEventListener('mousemove',mv);removeEventListener('mouseout',out)};
  },[]);
  return <div ref={ring} className="cursor-ring" aria-hidden="true"/>;
}
