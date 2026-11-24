const steps0=()=>({'Land & permits':false,Architecture:false,'Site preparation':false,Foundation:false,Structure:false,Roofing:false,'Windows & doors':false,Electrical:false,Plumbing:false,'Heating & cooling':false,Insulation:false,'Flooring & walls':false,Interior:false,Furniture:false,Appliances:false,Exterior:false,Garden:false,Pool:false,'Final inspection':false});
export const projectInitial={projects:[
 {id:'p1',name:'My House',homeType:'Villa',style:'Modern',landSize:250,size:90,floors:1,rooms:4,budget:60000,spent:0,progress:0,features:['Garage','Garden'],products:[],purchasedItems:[],updated:new Date().toISOString().slice(0,10),steps:steps0()}
]};
const up=(s,id,fn)=>({projects:s.projects.map(p=>p.id===id?{...fn(p),updated:new Date().toISOString().slice(0,10)}:p)});
import {overall} from '../utils/stages';
export function projectReducer(s,a){
  switch(a.type){
    case 'TOGGLE_TASK':return up(s,a.id,p=>{const tasks={...(p.tasks||{}),[a.taskId]:!(p.tasks||{})[a.taskId]};const q={...p,tasks};return {...q,progress:overall(q)}});
    case 'COMPLETE_STAGE':return up(s,a.id,p=>{const tasks={...(p.tasks||{})};for(let i=0;i<a.count;i++)tasks[a.stageId+i]=a.done;const q={...p,tasks};return {...q,progress:overall(q)}});
    case 'SET_TIER':return up(s,a.id,p=>({...p,tier:a.payload}));
    case 'SET_ROOMS':return up(s,a.id,p=>({...p,roomsPlan:a.payload}));
    case 'UPDATE_ROOM':return up(s,a.id,p=>({...p,roomsPlan:(p.roomsPlan||[]).map(r=>r.id===a.roomId?{...r,...a.patch}:r)}));
    case 'CREATE_PROJECT':return {projects:[...s.projects,{id:'p'+Date.now(),spent:0,progress:0,plannedTotal:0,products:[],purchasedItems:[],features:[],steps:steps0(),updated:new Date().toISOString().slice(0,10),...a.payload}]};
    case 'MIGRATE_PROJECT_ACCOUNTING':return up(s,a.id,p=>({...p,spent:Array.isArray(p.purchasedItems)?p.spent:0,purchasedItems:Array.isArray(p.purchasedItems)?p.purchasedItems:[],plannedTotal:p.products.reduce((sum,item)=>sum+item.price,0)}));
    case 'UPDATE_PROJECT':return up(s,a.id,p=>({...p,...a.payload}));
    case 'DELETE_PROJECT':return {projects:s.projects.filter(p=>p.id!==a.id)};
    case 'SET_STYLE':return up(s,a.id,p=>({...p,style:a.payload}));
    case 'SET_BUDGET':return up(s,a.id,p=>({...p,budget:Number(a.payload)}));
    case 'SET_FEATURES':return up(s,a.id,p=>({...p,features:a.payload}));
    case 'ADD_PRODUCT_TO_PROJECT':return up(s,a.id,p=>{if(p.products.some(x=>x.id===a.payload.id))return p;const products=[...p.products,a.payload];return {...p,products,plannedTotal:products.reduce((sum,item)=>sum+item.price,0)}});
    case 'REMOVE_PRODUCT_FROM_PROJECT':return up(s,a.id,p=>{const products=p.products.filter(i=>i.id!==a.payload);return {...p,products,plannedTotal:products.reduce((sum,item)=>sum+item.price,0)}});
    case 'RECORD_PURCHASE':return up(s,a.id,p=>{const items=a.items.map(item=>({...item,orderId:a.orderId,purchasedAt:a.purchasedAt}));return {...p,purchasedItems:[...(p.purchasedItems||[]),...items],spent:p.spent+items.reduce((sum,item)=>sum+item.price*item.qty,0)}});
    case 'UPDATE_PROGRESS':return up(s,a.id,p=>{const steps={...p.steps,[a.payload]:!p.steps[a.payload]};const v=Object.values(steps);return {...p,steps,progress:Math.round(v.filter(Boolean).length/v.length*100)}});
    default:return s;
  }
}
