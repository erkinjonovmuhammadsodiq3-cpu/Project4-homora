import {useState,useEffect} from 'react';
import {Link,NavLink} from 'react-router-dom';
import {FiSearch,FiHeart,FiShoppingBag,FiUser,FiMenu,FiX,FiBarChart2,FiSun,FiMoon} from 'react-icons/fi';
import {useCart,useCompare,useFav,useTheme} from '../context/AppContexts';
const links=[['Build','/build'],['Design','/design'],['Shop','/shop'],['Offers','/deals'],['Projects','/projects'],['Inspiration','/inspiration'],['Architects','/architecture']];
export default function Navbar(){
  const [small,setSmall]=useState(false),[open,setOpen]=useState(false);
  const {items}=useCart(),{favs}=useFav(),{compare}=useCompare(),{theme,toggleTheme}=useTheme();
  useEffect(()=>{const f=()=>setSmall(scrollY>60);addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);
  return <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur bg-warm/80 border-b border-stone/40 transition-all ${small?'py-2':'py-5'}`}>
   <nav className="mx-auto flex max-w-7xl items-center justify-between px-5" aria-label="Main">
    <Link to="/" className="font-display text-2xl tracking-[.25em]">HOMORA</Link>
    <ul className="hidden gap-6 text-sm xl:flex">{links.map(([n,p])=><li key={p}><NavLink to={p} className="whitespace-nowrap hover:text-accent">{n}</NavLink></li>)}</ul>
    <div className="flex items-center gap-3 text-xl sm:gap-4">
     <button aria-label="Search (Ctrl+K)" onClick={()=>dispatchEvent(new Event('homora-search'))}><FiSearch/></button>
     <Link to="/favorites" aria-label="Favorites" className="relative"><FiHeart/>{favs.length>0&&<b className="absolute -right-2 -top-2 text-[10px]">{favs.length}</b>}</Link>
    <Link to="/compare" aria-label="Compare products" className="relative hidden xl:block"><FiBarChart2/>{compare.length>0&&<b className="absolute -right-2 -top-2 text-[10px]">{compare.length}</b>}</Link>
    <Link to="/cart" id="cart-icon" aria-label="Cart" className="relative"><FiShoppingBag/>{items.length>0&&<b className="absolute -right-2 -top-2 text-[10px]">{items.reduce((a,i)=>a+i.qty,0)}</b>}</Link>
    <button className="hidden xl:block" onClick={toggleTheme} aria-label={`Switch to ${theme==='light'?'dark':'light'} mode`} title={`Switch to ${theme==='light'?'dark':'light'} mode`}>{theme==='light'?<FiMoon/>:<FiSun/>}</button>
    <Link to="/account" aria-label="Profile" className="hidden xl:block"><FiUser/></Link>
     <button className="xl:hidden" aria-label="Menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<FiX/>:<FiMenu/>}</button>
    </div>
   </nav>
  {open&&<ul className="grid max-h-[calc(100vh-72px)] grid-cols-2 gap-x-4 gap-y-3 overflow-y-auto bg-warm px-5 py-6 font-display text-2xl xl:hidden" onClick={()=>setOpen(false)}>{links.map(([n,p])=><li key={p}><Link to={p}>{n}</Link></li>)}<li><Link to="/compare">Compare</Link></li><li><Link to="/materials-calculator">Materials</Link></li><li><Link to="/account">Account</Link></li><li><Link to="/notifications">Notifications</Link></li><li><button className="text-base" onClick={toggleTheme}>{theme==='light'?'Dark mode':'Light mode'}</button></li></ul>}
  </header>;
}
