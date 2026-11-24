import {useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowRight,FiCheck,FiImage,FiUpload} from 'react-icons/fi';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
import ProductCard from '../components/ProductCard';
import {products,styles} from '../data/products';

const rooms={
  Interior:['Living room','Bedroom','Kitchen','Bathroom','Office','Dining room','Whole home'],
  Exterior:['Facade','Garden','Outdoor living','Pool','Whole home']
};
const roomCategories={
  'Living room':['Furniture','Lighting','Electronics','Decor'],Bedroom:['Furniture','Lighting','Flooring & Wall','Decor','Home Appliances'],
  Kitchen:['Kitchen','Home Appliances','Plumbing','Lighting','Flooring & Wall'],Bathroom:['Bathroom','Plumbing','Lighting','Flooring & Wall'],
  Office:['Furniture','Lighting','Electronics','Smart Home'],'Dining room':['Furniture','Lighting','Decor','Kitchen'],
  Facade:['Roofing & Drainage','Windows & Doors','Insulation & Waterproofing','Outdoor'],Garden:['Garden','Outdoor','Lighting','Pool'],
  'Outdoor living':['Outdoor','Garden','Lighting','Pool'],Pool:['Pool','Outdoor','Garden'],'Whole home':null
};
const scopeMap={
  'Walls & paint':['Flooring & Wall','Cement & Concrete','Bricks & Blocks'],Flooring:['Flooring & Wall'],Lighting:['Lighting','Electrical'],
  Furniture:['Furniture'],Appliances:['Home Appliances','Electronics'],Plumbing:['Plumbing','Bathroom'],
  Exterior:['Outdoor','Windows & Doors','Roofing & Drainage'],Garden:['Garden','Outdoor','Pool']
};
const scopes=['Walls & paint','Flooring','Lighting','Furniture','Appliances','Plumbing','Exterior','Garden'];

export function DesignStudio({scanMode=false}){
  const root=useRef(null);
  const [area,setArea]=useState('Interior'),[room,setRoom]=useState('Living room'),[style,setStyle]=useState('Modern');
  const [condition,setCondition]=useState('Existing room'),[budget,setBudget]=useState(3000),[width,setWidth]=useState(4),[depth,setDepth]=useState(5);
  const [selectedScopes,setSelectedScopes]=useState(['Furniture','Lighting']),[photo,setPhoto]=useState(''),[photoName,setPhotoName]=useState('');
  const [error,setError]=useState(''),[showResults,setShowResults]=useState(false);
  const picks=useMemo(()=>{
    const chosenCategories=roomCategories[room];
    const allowed=new Set(chosenCategories||products.map(product=>product.category));
    if(condition!=='Existing room'&&chosenCategories){selectedScopes.forEach(scope=>(scopeMap[scope]||[]).forEach(category=>allowed.add(category)))}
    const candidates=products.filter(product=>allowed.has(product.category)&&product.price<=budget&&product.stock>0);
    candidates.sort((a,b)=>(Number(b.style===style)-Number(a.style===style))||(b.styleMatch-a.styleMatch)||(b.compat-a.compat));
    let total=0;const result=[];
    for(const product of candidates){if(result.length===4)break;if(total+product.price<=budget){result.push(product);total+=product.price}}
    return result;
  },[budget,style,room,condition,selectedScopes]);
  const total=picks.reduce((sum,product)=>sum+product.price,0);
  useGSAP(()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo('.design-reveal',{y:18,opacity:0},{y:0,opacity:1,stagger:.08,duration:.6,ease:'power2.out'})},{scope:root});
  const upload=event=>{
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')||file.size>8*1024*1024){setError('Choose an image smaller than 8 MB.');return}
    setError('');setPhotoName(file.name);const reader=new FileReader();reader.onload=()=>setPhoto(String(reader.result||''));reader.readAsDataURL(file);
  };
  const switchArea=value=>{setArea(value);setRoom(rooms[value][0]);setShowResults(false)};
  const source=products.find(product=>(roomCategories[room]||[]).includes(product.category))||products[0];
  return <div ref={root} className="mx-auto max-w-7xl px-5 py-10 md:py-14">
    <section className="design-reveal grid gap-6 border-b border-stone/50 pb-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-[10px] uppercase tracking-[.22em] text-accent">HOMORA SPACE PLANNER</p><h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight md:text-7xl">{scanMode?'Start with the space you have.':'Make the space feel like yours.'}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-stone">Choose a room, style and budget. Add a photo as a visual reference and get a shortlist you can actually shop.</p></div><Link to="/shop" className="btn w-fit">Shop all products <FiArrowRight className="ml-2"/></Link></section>
    <div className="design-reveal mt-8 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
      <section className="grid content-start gap-5">
        <div><p className="mb-2 text-xs uppercase tracking-widest text-stone">01 · Choose an area</p><div className="grid grid-cols-2 border border-stone/60 p-1">{['Interior','Exterior'].map(value=><button key={value} onClick={()=>switchArea(value)} className={`py-2 text-sm transition ${area===value?'bg-char text-warm':''}`}>{value}</button>)}</div></div>
        <label className="grid gap-2 text-xs text-stone">Space<select value={room} onChange={event=>{setRoom(event.target.value);setShowResults(false)}} className="border border-stone/70 bg-transparent px-3 py-3 text-sm text-char">{rooms[area].map(value=><option key={value}>{value}</option>)}</select></label>
        <fieldset><legend className="mb-2 text-xs uppercase tracking-widest text-stone">02 · Project stage</legend><div className="grid grid-cols-3 gap-2">{['Existing room','Renovating','Building new'].map(value=><button key={value} onClick={()=>{setCondition(value);setShowResults(false)}} aria-pressed={condition===value} className={`border px-2 py-3 text-xs transition ${condition===value?'border-char bg-char text-warm':'border-stone/60 hover:border-char'}`}>{value}</button>)}</div></fieldset>
        {condition!=='Existing room'&&<fieldset><legend className="mb-2 text-xs uppercase tracking-widest text-stone">Include in the plan</legend><div className="grid grid-cols-2 gap-2">{scopes.filter(value=>area==='Interior'?value!=='Exterior'&&value!=='Garden':value==='Exterior'||value==='Garden'||value==='Lighting').map(value=><label key={value} className="flex items-center gap-2 border border-stone/40 px-3 py-2 text-xs"><input type="checkbox" checked={selectedScopes.includes(value)} onChange={()=>setSelectedScopes(items=>items.includes(value)?items.filter(item=>item!==value):[...items,value])}/>{value}</label>)}</div></fieldset>}
        <div><p className="mb-2 text-xs uppercase tracking-widest text-stone">03 · Choose your style</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{styles.map(value=><button key={value} onClick={()=>{setStyle(value);setShowResults(false)}} aria-pressed={style===value} className={`border px-3 py-3 text-left font-display text-sm transition ${style===value?'border-char bg-char text-warm':'border-stone/50 hover:-translate-y-0.5 hover:border-char'}`}>{value}</button>)}</div></div>
        <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-xs text-stone">Width (m)<input type="number" min="1" value={width} onChange={event=>setWidth(Math.max(1,Number(event.target.value)))} className="border border-stone/70 bg-transparent px-3 py-2 text-sm text-char"/></label><label className="grid gap-1 text-xs text-stone">Length (m)<input type="number" min="1" value={depth} onChange={event=>setDepth(Math.max(1,Number(event.target.value)))} className="border border-stone/70 bg-transparent px-3 py-2 text-sm text-char"/></label></div>
        <label className="grid gap-2 text-xs text-stone">Project budget <span className="flex justify-between text-base text-char"><span>$500</span><strong>${budget.toLocaleString()}</strong></span><input type="range" min="500" max="20000" step="250" value={budget} onChange={event=>{setBudget(Number(event.target.value));setShowResults(false)}} aria-label="Project budget"/></label>
        <div className="design-upload"><label htmlFor="space-photo" className="flex cursor-pointer items-center gap-3"><span className="grid h-10 w-10 place-items-center border border-stone/50"><FiUpload/></span><span><strong className="block text-sm">{photoName||'Add a room photo'}</strong><span className="mt-1 block text-xs text-stone">JPG, PNG or WEBP · up to 8 MB · optional</span></span></label><input id="space-photo" className="sr-only" type="file" accept="image/*" onChange={upload}/>{error&&<p role="alert" className="mt-2 text-xs text-accent">{error}</p>}</div>
        <button className="btn btn-dark justify-center" onClick={()=>setShowResults(true)}><FiCheck className="mr-2"/>Build my recommendations <FiArrowRight className="ml-2"/></button>
      </section>
      <section className="design-reveal"><div className="relative overflow-hidden bg-char"><img src={photo||source.image} alt={photo?'Uploaded room reference':`${room} reference`} className="aspect-[4/3] w-full object-cover opacity-90"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char/90 to-transparent p-5 text-warm md:p-7"><p className="text-[10px] uppercase tracking-[.2em] text-warm/70">{photo?'YOUR PHOTO':'SPACE REFERENCE'} · {room.toUpperCase()}</p><h2 className="mt-2 font-display text-3xl md:text-4xl">{room}, reimagined.</h2><p className="mt-2 text-xs text-warm/75">{width} × {depth} m · {(width*depth).toLocaleString()} m² · {style} · {condition}</p></div><span className="absolute right-3 top-3 border border-white/60 bg-char/40 px-3 py-2 text-[9px] uppercase tracking-widest text-white backdrop-blur">{area} concept</span></div>
        {showResults?<div className="mt-5 border border-stone/50 p-5 md:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-accent">MATCHED SHORTLIST</p><h3 className="mt-1 font-display text-3xl">Made for your brief.</h3></div><div className="text-right"><p className="text-xs text-stone">Selected items</p><p className="font-display text-2xl">${total.toLocaleString()} <span className="text-xs text-stone">/ ${budget.toLocaleString()}</span></p></div></div><p className="mt-3 text-xs leading-5 text-stone">Recommendations use your selected room, style and budget. Photo recognition and renovation rendering are not connected in this prototype; the upload is shown as a visual reference.</p>{picks.length?<div className="mt-5 grid gap-4 sm:grid-cols-2">{picks.map(product=><ProductCard key={product.id} p={product}/>)}</div>:<p className="mt-5 border-t border-stone/40 pt-5 text-sm">No products fit this budget. Increase the budget or browse the full shop.</p>}<Link to="/shop" className="btn btn-dark mt-5">Browse the shop <FiArrowRight className="ml-2"/></Link></div>:<div className="mt-5 grid grid-cols-3 gap-2"><div className="border-t border-stone/60 pt-3"><p className="font-display text-xl">{picks.length}</p><p className="text-[10px] text-stone">budget-fit picks</p></div><div className="border-t border-stone/60 pt-3"><p className="font-display text-xl">{Math.round(budget/Math.max(1,width*depth))}</p><p className="text-[10px] text-stone">budget / m²</p></div><div className="border-t border-stone/60 pt-3"><p className="font-display text-xl">{condition==='Existing room'?'Complete':'Plan & finish'}</p><p className="text-[10px] text-stone">project path</p></div></div>}
      </section>
    </div>
    <div className="design-reveal mt-12 border-t border-stone/50 pt-6"><p className="flex items-center gap-2 text-xs text-stone"><FiImage/> Visual concept is a planning aid, not a measured architectural drawing.</p></div>
  </div>;
}
