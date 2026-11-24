import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Heading,Progress} from '../components/ui';
import {STAGES,estimate} from '../utils/stages';
import {products,styles} from '../data/products';
import {useProjects} from '../context/AppContexts';
const types=['New House','Villa','Apartment','Cottage','Renovation','Outdoor Project'];
const feats=['Garage','Basement','Attic','Balcony','Terrace','Pool','Garden','Smart Home','Home Office','Gym','Guest Room'];

const Opt=({a,on,children})=><button onClick={on} aria-pressed={a} className={`card text-left transition ${a?'!bg-char text-warm':''}`}>{children}</button>;
export default function Build(){
  const [step,setStep]=useState(0),[d,setD]=useState({type:'Villa',land:400,size:180,floors:2,rooms:5,features:[],style:'Modern',budget:100000});
  const {dispatch}=useProjects(),nav=useNavigate();
  const set=(k,v)=>setD(o=>({...o,[k]:v}));
  const toggle=f=>set('features',d.features.includes(f)?d.features.filter(x=>x!==f):[...d.features,f]);
  const titles=['What are you building?','Dimensions','Features','Architecture style','Budget','Your plan & estimate'];
  const est=estimate({...d,homeType:d.type,landSize:d.land}),split=Object.fromEntries(STAGES.map(s=>[s.title,est.byStage[s.id]/est.total])),over=est.total>d.budget;
  const save=()=>{const newId='p'+Date.now();const budgetAllocation=Object.fromEntries(Object.entries(split).map(([name,ratio])=>[name,Math.round(d.budget*ratio)]));dispatch({type:'CREATE_PROJECT',payload:{id:newId,tier:'Balanced',name:`My ${d.type}`,homeType:d.type,landSize:d.land,size:d.size,floors:d.floors,rooms:d.rooms,style:d.style,budget:d.budget,budgetAllocation,features:d.features}});nav('/projects/'+newId)};
  return <div className="mx-auto max-w-5xl px-5 py-12"><Heading k={`Step ${step+1} / 6`}>{titles[step]}</Heading><div className="mb-6"><Progress value={(step+1)/6*100}/></div><div className="card mb-6 flex flex-wrap items-center justify-between gap-3 text-sm"><span>Live estimate · {d.size} m² · {d.floors} floors</span><b className="font-display text-2xl">${est.total.toLocaleString()}</b><span className={over?'text-accent':'text-green-700'}>{over?`$${(est.total-d.budget).toLocaleString()} over budget`:`$${(d.budget-est.total).toLocaleString()} under budget`}</span></div>
   {step===0&&<div className="grid gap-4 md:grid-cols-3">{types.map(t=><Opt key={t} a={d.type===t} on={()=>set('type',t)}>{t}</Opt>)}</div>}
   {step===1&&<div className="grid gap-4 md:grid-cols-2">{[['land','Land size (m²)'],['size','House size (m²)'],['floors','Floors'],['rooms','Rooms']].map(([k,l])=><label key={k} className="card">{l}<input type="number" min="1" value={d[k]} onChange={e=>set(k,+e.target.value)} className="mt-2 w-full bg-transparent text-3xl outline-none"/></label>)}</div>}
   {step===2&&<div className="grid grid-cols-2 gap-3 md:grid-cols-4">{feats.map(f=><Opt key={f} a={d.features.includes(f)} on={()=>toggle(f)}>{f}</Opt>)}</div>}
   {step===3&&<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{styles.map(s=><Opt key={s} a={d.style===s} on={()=>set('style',s)}><span className="font-display text-2xl">{s}</span></Opt>)}</div>}
   {step===4&&<label className="card block">Total budget ($)<input type="number" value={d.budget} onChange={e=>set('budget',+e.target.value)} className="mt-2 w-full bg-transparent font-display text-6xl outline-none"/></label>}
  {step===5&&<div><div className="mb-6 grid gap-5 md:grid-cols-[.8fr_1.2fr]"><img src={(products.find(product=>product.category==='Outdoor'&&product.style===d.style)||products.find(product=>product.category==='Outdoor')||products[0]).image} alt={`${d.style} home exterior reference`} className="aspect-[4/3] w-full object-cover"/><div><p className="text-xs uppercase tracking-widest text-accent">VISUAL REFERENCE · NOT A GENERATED PLAN</p><p className="mt-3 text-stone">{d.style} {d.type} · {d.floors} floors · {d.size} m² · {d.rooms} rooms · {d.features.join(', ')||'no extras'}</p><p className="mt-3 text-xs text-stone">Use this brief to begin your project. A measured architectural drawing requires a qualified professional.</p></div></div>
    {Object.entries(split).map(([k,v])=><div key={k} className="mb-3"><div className="flex justify-between"><span>{k}</span><span>${Math.round(d.budget*v).toLocaleString()}</span></div><div className="h-1.5 rounded bg-beige"><div className="h-full rounded bg-char" style={{width:Math.min(100,v*100)+'%'}}/></div></div>)}
    <p className="mt-6 font-display text-4xl">Total ${d.budget.toLocaleString()}</p><button className="btn btn-dark mt-6" onClick={save}>Save project</button></div>}
   <div className="mt-10 flex gap-3">{step>0&&<button className="btn" onClick={()=>setStep(step-1)}>Back</button>}{step<5&&<button className="btn btn-dark" onClick={()=>setStep(step+1)}>Next</button>}</div></div>;
}
