import {createContext,useContext,useEffect,useState} from 'react';
import usePersistedReducer from '../hooks/usePersistedReducer';
import {cartReducer,cartInitial} from '../reducers/cartReducer';
import {projectReducer,projectInitial} from '../reducers/projectReducer';
const Cart=createContext(),Fav=createContext(),Proj=createContext(),Auth=createContext();
export const useCart=()=>useContext(Cart),useFav=()=>useContext(Fav),useProjects=()=>useContext(Proj),useAuth=()=>useContext(Auth);
const favReducer=(s,a)=>a.type==='TOGGLE_FAVORITE'?(s.includes(a.payload)?s.filter(x=>x!==a.payload):[...s,a.payload]):s;
const compareReducer=(s,a)=>a.type==='TOGGLE_COMPARE'?(s.includes(a.payload)?s.filter(x=>x!==a.payload):s.length<3?[...s,a.payload]:s):s;
export function AppProviders({children}){
  const [cart,cartDispatch]=usePersistedReducer(cartReducer,'homora-cart',cartInitial);
  const [favs,favDispatch]=usePersistedReducer(favReducer,'homora-favs',[]);
  const [compare,compareDispatch]=usePersistedReducer(compareReducer,'homora-compare',[]);
  const [pState,pDispatch]=usePersistedReducer(projectReducer,'homora-projects',projectInitial);
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('homora-user')||sessionStorage.getItem('homora-user')||'null')}catch{return null}});
  const [theme,setTheme]=useState(()=>localStorage.getItem('homora-theme')||'light');
  useEffect(()=>{localStorage.removeItem('homora-user');sessionStorage.removeItem('homora-user');if(user)(user.remember?localStorage:sessionStorage).setItem('homora-user',JSON.stringify(user))},[user]);
  useEffect(()=>{pState.projects.forEach(project=>{if(!Array.isArray(project.purchasedItems)||project.plannedTotal===undefined)pDispatch({type:'MIGRATE_PROJECT_ACCOUNTING',id:project.id})})},[pState.projects]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('homora-theme',theme)},[theme]);
  const [activeId,setActiveId]=useState(()=>localStorage.getItem('homora-active')||'');
  useEffect(()=>{if(activeId)localStorage.setItem('homora-active',activeId)},[activeId]);
  const active=pState.projects.find(p=>p.id===activeId)||pState.projects[0];
  const dispatchP=a=>{pDispatch(a);if(a.type==='CREATE_PROJECT'&&a.payload?.id)setActiveId(a.payload.id)};
  return <Auth.Provider value={{user,login:(identifier,name,remember=true)=>setUser({email:identifier.includes('@')?identifier:null,phone:identifier.includes('@')?null:identifier,name:name|| (identifier.includes('@')?identifier.split('@')[0]:'Homeowner'),remember}),updateProfile:patch=>setUser(current=>current?{...current,...(typeof patch==='string'?{name:patch}:patch)}:current),logout:()=>setUser(null)}}>
   <Compare.Provider value={{compare,dispatch:compareDispatch}}>
   <Proj.Provider value={{projects:pState.projects,dispatch:dispatchP,active,setActive:setActiveId}}>
   <Fav.Provider value={{favs,dispatch:favDispatch}}>
   <Cart.Provider value={{items:cart.items,dispatch:cartDispatch}}>
   <Theme.Provider value={{theme,toggleTheme:()=>setTheme(v=>v==='light'?'dark':'light')}}>{children}</Theme.Provider>
   </Cart.Provider></Fav.Provider></Proj.Provider></Compare.Provider></Auth.Provider>;
}
const Compare=createContext(),Theme=createContext();
export const useCompare=()=>useContext(Compare),useTheme=()=>useContext(Theme);
