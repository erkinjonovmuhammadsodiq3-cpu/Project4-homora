import {products} from '../data/products';
import {FiMap,FiTool,FiLayers,FiHome,FiGrid,FiSun,FiKey} from 'react-icons/fi';
export const STAGES=[
 {id:'plan',title:'Land & Architecture',icon:FiMap,desc:'Confirm the plot, permits and the floor plan before anything is built.',cats:['Land & Foundation','Tools'],tasks:['Confirm land & permits','Choose architect or plan','Approve floor plan','Finalize budget']},
 {id:'build',title:'Foundation & Construction',icon:FiTool,desc:'Foundation, walls, roof, windows, electrical and plumbing — the shell of your home.',cats:['Cement & Concrete','Bricks & Blocks','Roofing & Drainage','Insulation & Waterproofing','Windows & Doors','Electrical','Plumbing','Heating & Cooling'],tasks:['Site preparation','Foundation','Walls & structure','Roof','Windows & doors','Electrical & plumbing']},
 {id:'interior',title:'Interior Design',icon:FiLayers,desc:'Floors, walls, kitchen, bathrooms and lighting — room by room.',cats:['Flooring & Wall','Lighting','Kitchen','Bathroom'],tasks:['Flooring & wall finishes','Kitchen & bathrooms','Lighting plan','Paint & details']},
 {id:'exterior',title:'Exterior Design',icon:FiHome,desc:'Facade, roof finish, doors, fence and outdoor lighting.',cats:['Outdoor','Windows & Doors','Roofing & Drainage','Lighting'],tasks:['Facade & cladding','Exterior doors & windows','Fence & gate','Outdoor lighting']},
 {id:'furniture',title:'Furniture & Decor',icon:FiGrid,desc:'Furniture, appliances and the decor that makes it feel like yours.',cats:['Furniture','Decor','Home Appliances','Electronics'],tasks:['Living room furniture','Bedrooms','Appliances','Decor & textiles']},
 {id:'garden',title:'Garden & Outdoor',icon:FiSun,desc:'Garden, terrace, irrigation and the pool if you planned one.',cats:['Garden','Outdoor','Pool'],tasks:['Garden layout','Terrace & seating','Irrigation','Pool (if planned)']},
 {id:'final',title:'Finished Home',icon:FiKey,desc:'Smart-home setup, inspection and the final walkthrough.',cats:['Smart Home','Electronics','Decor'],tasks:['Smart home setup','Deep clean & inspection','Final walkthrough','Move in']}];
export const TIERS={Economy:.8,Balanced:1,Premium:1.35};
const SM={Modern:1.05,Minimalist:1,Classic:1.1,Luxury:1.45,Scandinavian:1.05,Industrial:.95,Eco:1.12,Traditional:1};
const TM={'New House':1,Villa:1.1,Apartment:.8,Cottage:.9,Renovation:.55,'Outdoor Project':.25};
const r50=n=>Math.round(n/50)*50;
export function estimate(p,tier=p.tier||'Balanced'){
  const t=TIERS[tier],s=SM[p.style]||1,ty=TM[p.homeType]??1,z=p.size||120,f=1+((p.floors||1)-1)*.06,n=p.rooms||4,h=x=>(p.features||[]).includes(x),land=p.landSize||300;
  const by={plan:Math.max(900,z*9*s*ty)*t,build:(z*260*s*ty*f+(h('Basement')?z*70:0)+(h('Attic')?2500:0))*t,
   interior:(z*70*s+n*350)*Math.max(.5,ty)*t,exterior:(z*22*s+(h('Garage')?5500:0)+(h('Terrace')?3200:0)+(h('Balcony')?1800:0))*Math.max(.4,ty)*t,
   furniture:((n*1100+1500)*s+(h('Home Office')?1200:0)+(h('Gym')?1500:0)+(h('Guest Room')?1400:0))*Math.max(.5,ty)*t,
   garden:(land*9+(h('Garden')?3500:0)+(h('Pool')?16000:0))*t,final:(z*8+(h('Smart Home')?3500:0)+1200)*Math.max(.5,ty)*t};
  Object.keys(by).forEach(k=>by[k]=r50(by[k]));
  return {byStage:by,total:Object.values(by).reduce((a,b)=>a+b,0)};
}
export function stageState(p,st){const tk=p.tasks||{},done=st.tasks.filter((_,i)=>tk[st.id+i]).length,total=st.tasks.length;
  return {done,total,pct:Math.round(done/total*100),status:done===0?'Not started':done===total?'Completed':'In progress'}}
export const overall=p=>{const all=STAGES.reduce((a,s)=>a+s.tasks.length,0),d=STAGES.reduce((a,s)=>a+stageState(p,s).done,0);return Math.round(d/all*100)};
export function recommend(p,st,est,n=4){
  const cap=Math.max(150,(est.byStage[st.id]||0)*.18);
  return products.filter(x=>st.cats.includes(x.category)&&x.stock!==0).map(x=>({...x,inStyle:x.style===p.style,inBudget:x.price<=cap,fit:Math.round((x.style===p.style?45:15)+x.rating*8+(x.price<=cap?25:0))})).sort((a,b)=>b.fit-a.fit).slice(0,n);
}
export const ROOM_CATS={'Living':['Furniture','Lighting','Electronics','Decor'],Kitchen:['Kitchen','Home Appliances','Lighting'],Bedroom:['Furniture','Lighting','Decor'],Bathroom:['Bathroom','Lighting'],Dining:['Furniture','Lighting','Decor'],Home:['Furniture','Electronics','Lighting'],Guest:['Furniture','Decor']};
export const defaultRooms=p=>['Living room','Kitchen','Master bedroom','Bathroom','Bedroom 2','Dining room','Home office','Bedroom 3','Guest room','Bathroom 2'].slice(0,Math.max(4,Math.min(10,p.rooms||4))).map((name,i)=>({id:'r'+i,name,style:p.style,products:[]}));
export const roomCats=name=>ROOM_CATS[name.split(' ')[0]]||ROOM_CATS.Living;
