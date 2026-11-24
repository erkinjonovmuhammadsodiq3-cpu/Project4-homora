import {Routes,Route,Link,useLocation} from 'react-router-dom';
import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FX from './components/FX';
import Background from './components/Background';
import {LoadingScreen,SearchOverlay,BackToTop,SupportWidget} from './components/Extras';
import Home from './pages/Home';
import Build from './pages/Build';
import {Shop,Product,Cart,Favorites,Compare} from './pages/ShopPages';
import {Checkout,Orders} from './pages/Checkout';
import {Projects} from './pages/ProjectPages';
import {ProjectDetail} from './pages/ProjectDashboard';
import ProjectBar from './components/ProjectBar';
import {Login,Module} from './pages/Misc';
import {DesignStudio} from './pages/DesignStudio';
import {ArchitectureHub,Inspiration} from './pages/DiscoveryPages';
import {AccountHub,NotificationsHub,SettingsHub} from './pages/AccountPages';
import {HomeCollection} from './pages/CollectionPages';
import {StorePage} from './pages/StorePage';
import {DealsPage,MaterialsCalculator} from './pages/MarketplaceTools';
export default function App(){
  const loc=useLocation(),ref=useRef();
  useEffect(()=>{scrollTo(0,0);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo(ref.current,{y:12},{y:0,duration:.4,ease:'power2.out'})},[loc.pathname]);
  return <><LoadingScreen/><FX/><Background/><SearchOverlay/><BackToTop/><SupportWidget/><Navbar/><main ref={ref} className="pt-20"><ProjectBar/>
   <Routes>
    <Route path="/" element={<Home/>}/><Route path="/build" element={<Build/>}/>
    <Route path="/shop" element={<Shop key={loc.search}/>}/><Route path="/shop/:category" element={<Shop key={loc.pathname+loc.search}/>}/><Route path="/product/:id" element={<Product/>}/>
    <Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/favorites" element={<Favorites/>}/><Route path="/compare" element={<Compare/>}/>
    <Route path="/projects" element={<Projects/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/>
    <Route path="/login" element={<Login/>}/><Route path="/register" element={<Login register/>}/>
    <Route path="/orders" element={<Orders/>}/>
    <Route path="/design" element={<DesignStudio/>}/><Route path="/room-scan" element={<DesignStudio scanMode/>}/>
    <Route path="/inspiration" element={<Inspiration/>}/><Route path="/architecture" element={<ArchitectureHub/>}/>
    <Route path="/exterior" element={<HomeCollection kind="Exterior"/>}/><Route path="/garden" element={<HomeCollection kind="Garden"/>}/>
    <Route path="/account" element={<AccountHub/>}/><Route path="/notifications" element={<NotificationsHub/>}/><Route path="/settings" element={<SettingsHub/>}/>
    <Route path="/stores/:brand" element={<StorePage/>}/>
    <Route path="/deals" element={<DealsPage/>}/><Route path="/materials-calculator" element={<MaterialsCalculator/>}/>
   </Routes></main>
   {loc.pathname==='/'&&<Footer/>}</>;
}
