import {useRef} from 'react';
import {gsap} from 'gsap';
export function Magnetic({children,className='btn',...p}){
  const r=useRef();
  const move=e=>{const b=r.current.getBoundingClientRect();gsap.to(r.current,{x:(e.clientX-b.left-b.width/2)*.2,y:(e.clientY-b.top-b.height/2)*.3,duration:.3})};
  return <button ref={r} className={className} onMouseMove={move} onMouseLeave={()=>gsap.to(r.current,{x:0,y:0,duration:.4})} {...p}>{children}</button>;
}
export const Progress=({value})=><div className="h-1.5 w-full rounded bg-beige" role="progressbar" aria-valuenow={value}><div className="h-full rounded bg-char transition-all duration-700" style={{width:value+'%'}}/></div>;
export const Heading=({k,children})=><div className="mb-8"><p className="text-xs tracking-[.3em] text-accent uppercase">{k}</p><h2 className="mt-2 font-display text-4xl md:text-6xl">{children}</h2></div>;
