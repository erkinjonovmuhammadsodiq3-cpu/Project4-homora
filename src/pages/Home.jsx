import {useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {useGSAP} from '@gsap/react';
import {FiArrowDownRight,FiArrowRight,FiCheck} from 'react-icons/fi';
import {Heading,Progress} from '../components/ui';
import ProductCard from '../components/ProductCard';
import {products,stages} from '../data/products';
import {useProjects} from '../context/AppContexts';

const featuredCategories=['Furniture','Home Appliances','Lighting','Kitchen','Bathroom','Electrical','Roofing & Drainage','Garden'];
const stageDescriptions=[
  ['The first line is yours.','Start with land, a renovation, a room or a small outdoor project.'],
  ['A clear plan changes everything.','Bring dimensions and an architectural brief together before the build begins.'],
  ['From foundation to finish.','Find the materials, systems and tools that move each stage forward.'],
  ['Make the inside feel like home.','Choose the furniture, lighting and finishes that belong in your rooms.'],
  ['Every detail has a place.','Connect appliances and everyday pieces to the project you are building.'],
  ['Make room outside, too.','Plan a garden, terrace, lighting, pool or a complete exterior.'],
  ['Keep the whole journey in view.','Track your tasks, planned products and actual spend in one place.']
];
const stageCategories=['Land & Foundation','Windows & Doors','Cement & Concrete','Furniture','Home Appliances','Garden','Shop'];
gsap.registerPlugin(ScrollTrigger,SplitText,useGSAP);

export default function Home(){
  const root=useRef(null),tl=useRef(null),[stage,setStage]=useState(0),{projects}=useProjects(),project=projects[0];
  const offers=products.filter(product=>product.originalPrice).slice(0,4);
  const roomCards=[['Living room','Furniture',products.find(product=>product.category==='Furniture')],['Kitchen','Kitchen',products.find(product=>product.category==='Kitchen')],['Bathroom','Bathroom',products.find(product=>product.category==='Bathroom')],['Garden & pool','Pool',products.find(product=>product.category==='Pool')]];
  const purchased=project?.spent||0,planned=project?.plannedTotal??(project?.products?.reduce((sum,item)=>sum+item.price,0)||0);
  useGSAP(()=>{
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const mobile=matchMedia('(max-width: 700px)').matches;
    const timeline=gsap.timeline({paused:true,onUpdate:()=>setStage(Math.min(6,Math.floor(timeline.progress()*6.999)))});timeline.timeScale(1.4);tl.current=timeline;ScrollTrigger.create({trigger:'.build-scene',start:'top 70%',once:true,onEnter:()=>reduced?timeline.progress(1):timeline.play()});
    timeline.from('.plot-trace',{strokeDashoffset:800,strokeDasharray:800,stagger:.2,duration:.8})
      .from('.foundation',{scaleX:0,transformOrigin:'left',duration:.65})
      .from('.house-walls',{scaleY:0,transformOrigin:'bottom',duration:1})
      .from('.house-roof',{y:-65,opacity:0,duration:.7})
      .from('.house-window',{scale:0,transformOrigin:'center',stagger:.12,duration:.4})
      .from('.house-door',{scaleY:0,transformOrigin:'bottom',duration:.45})
      .from('.room-furniture',{y:18,opacity:0,stagger:.12,duration:.45})
      .from('.garden-tree',{scaleY:0,transformOrigin:'bottom',stagger:.1,duration:.5})
      .from('.pool-water',{scaleX:0,transformOrigin:'left',duration:.55});
    gsap.utils.toArray('.home-reveal').forEach(element=>gsap.from(element,{y:35,opacity:0,duration:.7,scrollTrigger:{trigger:element,start:'top 88%'}}));
  },{scope:root});
  return <div ref={root}>
    <section className="home-hero mx-auto grid max-w-7xl overflow-hidden px-5 pb-12 pt-12 md:min-h-[680px] md:grid-cols-[.88fr_1.12fr] md:items-center md:gap-8 md:py-12">
      <div className="relative z-10 py-8 md:py-14"><p className="text-[10px] uppercase tracking-[.24em] text-accent">A HOME, BUILT A LITTLE BETTER</p><h1 className="hero-title mt-5 font-display text-6xl leading-[.93] md:text-7xl lg:text-8xl">YOUR HOME<br/>STARTS HERE.</h1><p className="mt-6 max-w-lg text-base leading-7 text-char/70">Shop what you need. Plan what comes next. HOMORA brings every room, material and home project into one considered place.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/shop" className="btn btn-dark">Shop for your home <FiArrowRight className="ml-2"/></Link><Link to="/build" className="btn">Plan a home <FiArrowDownRight className="ml-2"/></Link></div><div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[.13em] text-stone"><span>60 considered products</span><span>22 home categories</span><span>One project at a time</span></div></div>
      <div className="home-hero-image relative mt-5 min-h-[360px] overflow-hidden md:mt-0 md:min-h-[570px]"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88" alt="Warm contemporary living room with natural light and carefully selected furnishings" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-char/70 via-transparent to-transparent"/><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-warm md:bottom-8 md:left-8 md:right-8"><div><p className="text-[10px] uppercase tracking-[.2em] text-warm/70">THE HOMORA EDIT</p><p className="mt-2 font-display text-3xl">Room by room. Step by step.</p></div><Link to="/inspiration" aria-label="Explore inspiration" className="grid h-11 w-11 place-items-center rounded-full border border-white/70 transition hover:translate-x-1"><FiArrowRight/></Link></div><div className="home-image-index">01 / 08 · LIVING</div></div>
    </section>

    <section className="build-scene relative overflow-hidden bg-char text-warm">
      <div className="scene-grid absolute inset-0" aria-hidden="true"/>
      <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-6 px-5 py-16 md:min-h-[720px] md:grid-cols-[.72fr_1.28fr] md:gap-10 md:py-14">
        <div className="relative z-10 max-w-lg"><p className="text-[10px] uppercase tracking-[.28em] text-beige">THE HOMORA BUILD SEQUENCE</p><p className="mt-5 text-xs uppercase tracking-[.25em] text-warm/65">0{stage+1} / {stages[stage]}</p><h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{stageDescriptions[stage][0]}</h2><p className="mt-4 max-w-md text-sm leading-6 text-warm/70">{stageDescriptions[stage][1]}</p><div className="mt-6 flex items-center gap-2" aria-label={`Build sequence step ${stage+1} of ${stages.length}`}>{stages.map((name,index)=><span key={name} className={`h-1 flex-1 ${index<=stage?'bg-beige':'bg-warm/20'}`}/>)}</div><div className="mt-7 flex flex-wrap gap-3"><Link to={stage===6?'/projects':'/shop'} className="btn border-warm text-warm hover:bg-warm hover:text-char">{stage===6?'Track your project':`Shop ${stageCategories[stage]}`} <FiArrowRight className="ml-2"/></Link><Link to="/build" className="inline-flex items-center text-xs text-warm/65 underline underline-offset-4">Start from your own brief</Link></div></div>
        <div className="scene-visual relative z-10"><div className="scene-visual-label"><span>HOMORA / HOME STUDY</span><span>0{stage+1} — 07</span></div><svg viewBox="0 0 900 540" role="img" aria-label="House taking shape from an empty plot through construction and landscaping" className="w-full" fill="none" stroke="#e2eadb" strokeWidth="2">
          <path className="plot-trace" d="M55 430H845M110 430V355H790V430M110 355L450 250L790 355" strokeOpacity=".42"/>
          <path className="plot-trace" d="M155 430V382M745 430V382M100 444H800" strokeOpacity=".5"/>
          <rect className="foundation" x="250" y="370" width="400" height="32" fill="#8a9a88" stroke="none"/>
          <rect className="house-walls" x="270" y="185" width="360" height="185" fill="#373934"/>
          <path className="house-roof" d="M235 190L450 82L665 190Z" fill="#4f7f5c" stroke="#b6d3ba"/>
          <path d="M450 83V370M270 278H630" stroke="#e2eadb" strokeOpacity=".25"/>
          <rect className="house-window" x="305" y="220" width="88" height="60" fill="#c8d5d0" stroke="#e8f0e1"/><rect className="house-window" x="506" y="220" width="88" height="60" fill="#c8d5d0" stroke="#e8f0e1"/>
          <rect className="house-window" x="305" y="300" width="72" height="58" fill="#c8d5d0" stroke="#e8f0e1"/><rect className="house-door" x="418" y="287" width="64" height="83" fill="#815d48" stroke="#e8f0e1"/>
          <rect className="room-furniture" x="350" y="339" width="105" height="23" rx="4" fill="#b9c8b0" stroke="none"/><rect className="room-furniture" x="520" y="330" width="42" height="32" fill="#b9c8b0" stroke="none"/>
          <g className="garden-tree"><path d="M148 430V358"/><circle cx="148" cy="337" r="40" fill="#536e52" stroke="none"/></g><g className="garden-tree"><path d="M746 430V366"/><circle cx="746" cy="344" r="34" fill="#536e52" stroke="none"/></g>
          <rect className="pool-water" x="500" y="444" width="190" height="34" fill="#557d82" stroke="#c6d7d1"/>
          <path d="M520 461H670" stroke="#dce7e1" strokeOpacity=".6"/>
        </svg><div className="relative z-10 mt-4 flex flex-wrap gap-2">{['Land','Plan','Walls','Roof','Rooms','Garden','Home'].map((n,i)=><button key={n} onClick={()=>tl.current&&tl.current.tweenTo(tl.current.duration()*(i+1)/7,{duration:1.2,ease:'power2.inOut'})} style={stage===i?{background:'#eef3e8',color:'#17201a'}:{}} className="rounded-full border border-[#eef3e8]/40 px-4 py-1.5 text-xs transition hover:-translate-y-0.5">{n}</button>)}</div><div className="scene-visual-note"><span>CONCEPT VISUAL</span><span>Not a measured construction drawing</span></div></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 md:py-24"><div className="mb-6 flex items-end justify-between gap-4"><Heading k="Shop by space">Start with the room.</Heading><Link to="/shop" className="hidden items-center text-xs uppercase tracking-widest sm:inline-flex">All products <FiArrowRight className="ml-2"/></Link></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{roomCards.map(([label,target,product],index)=><Link key={label} to={`/shop/${encodeURIComponent(target)}`} className="home-room-card group relative min-h-44 overflow-hidden md:min-h-60"><img src={product.image} alt={`${label} product and room inspiration`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute inset-0 bg-gradient-to-t from-char/75 via-char/5 to-transparent"/><span className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-warm md:bottom-6 md:left-6"><span><span className="block text-[9px] uppercase tracking-[.18em] text-warm/70">0{index+1} / ROOM EDIT</span><span className="mt-1 block font-display text-xl md:text-2xl">{label}</span></span><FiArrowRight className="mb-1 transition group-hover:translate-x-1"/></span></Link>)}</div></section>

    <section className="mx-auto max-w-7xl px-5 pb-10"><div className="home-promo-band grid gap-6 overflow-hidden bg-[#e8ded0] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10"><div><p className="text-[10px] uppercase tracking-[.2em] text-accent">A LITTLE SOMETHING FOR YOUR NEXT PROJECT</p><h2 className="mt-2 font-display text-3xl md:text-4xl">Take 10% off your first demo basket.</h2><p className="mt-2 text-sm text-char/70">Use HOMORA10 at checkout. Pair room-ready pieces with a plan that fits your budget.</p></div><Link to="/shop" className="btn btn-dark w-fit">Explore current offers <FiArrowRight className="ml-2"/></Link></div></section>

    {offers.length>0&&<section className="mx-auto max-w-7xl px-5 py-12 md:py-16"><div className="mb-6 flex items-end justify-between gap-4"><Heading k="Current offers">Good pieces. Better prices.</Heading><Link to="/shop" className="hidden items-center text-xs uppercase tracking-widest sm:inline-flex">Shop all <FiArrowRight className="ml-2"/></Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{offers.map(product=><ProductCard key={product.id} p={product}/>)}</div></section>}

    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16"><div className="mb-6 flex items-end justify-between gap-4"><Heading k="From ground to garden">The whole home, in one shop.</Heading><Link to="/shop" className="hidden items-center text-xs uppercase tracking-widest sm:inline-flex">Browse 22 categories <FiArrowRight className="ml-2"/></Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{featuredCategories.map((category,index)=><Link key={category} to={`/shop/${encodeURIComponent(category)}`} className="home-category group flex min-h-28 items-end justify-between border border-stone/50 p-4 transition duration-300 hover:-translate-y-1 hover:border-char md:min-h-36 md:p-5"><span><span className="block text-[9px] uppercase tracking-[.18em] text-accent">0{index+1}</span><span className="mt-2 block font-display text-lg md:text-xl">{category}</span></span><FiArrowRight className="transition group-hover:translate-x-1"/></Link>)}</div></section>

    {project&&<section className="mx-auto max-w-7xl px-5 py-12"><div className="project-pulse grid gap-6 bg-char p-6 text-warm md:grid-cols-[1fr_1fr_auto] md:items-center md:p-9"><div><p className="text-[10px] uppercase tracking-[.2em] text-beige">YOUR HOME, IN MOTION</p><h2 className="mt-2 font-display text-3xl">{project.name}</h2><p className="mt-2 text-xs text-warm/65">{project.homeType||'Home project'} · {project.style} · {project.progress}% of build tasks complete</p></div><div><div className="mb-2 flex justify-between text-xs"><span>Build tasks</span><strong>{project.progress}%</strong></div><Progress value={project.progress}/><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-warm/70"><span>${purchased.toLocaleString()} spent</span><span>${planned.toLocaleString()} planned</span><span>${Math.max(0,project.budget-purchased).toLocaleString()} left</span></div></div><Link to={`/projects/${project.id}`} className="btn w-fit border-warm text-warm">Open project <FiArrowRight className="ml-2"/></Link></div></section>}

    <section className="home-final relative overflow-hidden bg-char px-5 py-20 text-center text-warm md:py-28"><div className="home-final-grid"/><div className="relative"><p className="text-[10px] uppercase tracking-[.25em] text-beige">YOUR NEXT CHAPTER STARTS HERE</p><h2 className="mx-auto mt-4 max-w-5xl font-display text-5xl leading-tight md:text-7xl">Make the whole home happen.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-warm/70">From foundation materials to the final lamp, make each choice part of one bigger plan.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/shop" className="btn border-warm text-warm">Start shopping <FiArrowRight className="ml-2"/></Link><Link to="/build" className="btn border-warm/50 text-warm/75">Create a home plan</Link></div><FiCheck className="mx-auto mt-10 text-beige/60"/></div></section>
  </div>;
}