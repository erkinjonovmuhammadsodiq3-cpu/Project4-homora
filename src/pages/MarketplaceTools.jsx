import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowRight,FiCheck,FiPackage} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import {Heading} from '../components/ui';
import {products} from '../data/products';
import {useCart} from '../context/AppContexts';
import {toast} from '../components/Background';

const cash=value=>`$${Number(value).toLocaleString(undefined,{maximumFractionDigits:2})}`;
const readPromotions=()=>{try{return JSON.parse(localStorage.getItem('homora-promotions')||'[]')}catch{return []}};

export function DealsPage(){
  const discounted=products.filter(product=>product.originalPrice&&product.originalPrice>product.price).sort((a,b)=>(b.originalPrice-b.price)-(a.originalPrice-a.price));
  const [claimed,setClaimed]=useState(()=>localStorage.getItem('homora-promo-code')==='HOMORA10');
  const promotions=readPromotions();
  const claim=()=>{localStorage.setItem('homora-promo-code','HOMORA10');setClaimed(true);toast('HOMORA10 is ready for checkout')};
  return <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
    <section className="glass-panel relative overflow-hidden p-7 md:p-12"><div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border border-accent/20"/><p className="text-[10px] uppercase tracking-[.22em] text-accent">HOMORA · THE CONSIDERED EDIT</p><h1 className="relative mt-3 max-w-3xl font-display text-5xl md:text-7xl">Good finds for a home in progress.</h1><p className="relative mt-4 max-w-xl text-sm leading-6 text-stone">Browse catalog offers and keep your demo coupons handy. Prices and promotions are sample data, not live seller campaigns.</p><button onClick={claim} className="btn btn-dark relative mt-6">{claimed?<><FiCheck className="mr-2"/>HOMORA10 saved</>:'Save 10% demo code'} <span className="ml-2 rounded-full bg-white/10 px-2 py-1">HOMORA10</span></button></section>
    <section className="mt-10"><Heading k="Limited catalog offers">Worth a closer look</Heading>{discounted.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{discounted.map(product=><ProductCard key={product.id} p={product}/>)}</div>:<p className="border-y border-stone/40 py-8 text-sm text-stone">No catalog discounts are currently listed.</p>}</section>
    <section className="mt-12 rounded-2xl border border-stone/40 p-6 md:p-8"><p className="text-[10px] uppercase tracking-[.2em] text-accent">Your saved codes</p><div className="mt-4 flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-3xl">HOMORA10 · 10% off</h2><p className="mt-1 text-sm text-stone">Demo checkout coupon saved in this browser. One code applies to your eligible basket.</p></div><span className="rounded-full bg-accent/10 px-4 py-2 text-xs text-accent">{claimed?'Ready to use':'Not saved'}</span></div></section>
    <section className="mt-12"><Heading k="Your activity">Recently used offers</Heading>{promotions.length?<div className="divide-y divide-stone/30 border-y border-stone/40">{promotions.slice().reverse().map((promotion,index)=><div key={`${promotion.code}-${index}`} className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span>{promotion.code} · {promotion.description}</span><span className="text-xs text-stone">{new Date(promotion.usedAt).toLocaleDateString()}</span></div>)}</div>:<p className="border-y border-stone/40 py-6 text-sm text-stone">Applied promo codes will appear here after placing an order.</p>}</section>
    <Link to="/shop" className="btn mt-9">Explore all products <FiArrowRight className="ml-2"/></Link>
  </div>;
}

export function MaterialsCalculator(){
  const {dispatch}=useCart();
  const [productId,setProductId]=useState(products.find(product=>product.category==='Flooring & Wall')?.id||products[0].id);
  const [area,setArea]=useState('10'),[coverage,setCoverage]=useState('1.5'),[waste,setWaste]=useState('10'),[added,setAdded]=useState(false);
  const product=products.find(item=>item.id===productId)||products[0];
  const units=useMemo(()=>Math.max(0,Math.ceil((Number(area)||0)/(Number(coverage)||1)*(1+(Number(waste)||0)/100))),[area,coverage,waste]);
  const total=units*product.price;
  const materialList=products.filter(item=>['Land & Foundation','Cement & Concrete','Bricks & Blocks','Roofing & Drainage','Flooring & Wall','Insulation & Waterproofing','Electrical','Plumbing','Tools'].includes(item.category));
  const addToCart=()=>{if(!units||units>product.stock){toast(units>product.stock?'Requested quantity exceeds the displayed demo stock.':'Enter an area greater than zero.');return}dispatch({type:'ADD_TO_CART',payload:product,quantity:units});setAdded(true);toast(`${units} ${product.name} added to the cart`);window.setTimeout(()=>setAdded(false),1800)};
  return <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
    <Heading k="Plan before you buy">Material estimator</Heading>
    <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_.8fr]">
      <section className="glass-panel p-6 md:p-8"><p className="text-sm leading-6 text-stone">Estimate quantities for a surface or project area. Coverage varies by product and installation; check the supplier specification and confirm measurements before ordering.</p>
        <div className="mt-6 grid gap-4"><label className="grid gap-2 text-xs text-stone">Catalog product<select value={productId} onChange={event=>{setProductId(event.target.value);setAdded(false)}} className="auth-input">{materialList.map(item=><option key={item.id} value={item.id}>{item.name} · {item.category}</option>)}</select></label>
          <label className="grid gap-2 text-xs text-stone">Area to cover (m²)<input type="number" min="0.1" step="0.1" value={area} onChange={event=>setArea(event.target.value)} className="auth-input"/></label>
          <label className="grid gap-2 text-xs text-stone">Coverage per unit (m²)<input type="number" min="0.01" step="0.01" value={coverage} onChange={event=>setCoverage(event.target.value)} className="auth-input"/><span className="text-[10px]">Enter the coverage from the product packaging; default is a planning example.</span></label>
          <label className="grid gap-2 text-xs text-stone">Extra for cuts / waste (%)<input type="number" min="0" max="50" step="1" value={waste} onChange={event=>setWaste(event.target.value)} className="auth-input"/></label>
        </div>
      </section>
      <aside className="card h-fit"><p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-accent"><FiPackage/> Estimate</p><div className="mt-5 flex items-center gap-3"><img src={product.image} alt="" className="h-16 w-16 rounded-lg object-cover"/><div><p className="text-sm">{product.name}</p><p className="text-xs text-stone">{cash(product.price)} per catalog unit</p></div></div><p className="mt-7 font-display text-5xl">{units} <span className="text-lg">units</span></p><p className="mt-1 text-xs text-stone">Includes {waste||0}% extra allowance · estimated catalog total <strong className="text-char">{cash(total)}</strong></p><p className="mt-4 text-[10px] leading-5 text-stone">Planning estimate only; it does not replace an architect, builder or supplier's quantity takeoff.</p><button disabled={!units||units>product.stock} onClick={addToCart} className="btn btn-dark mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50">{added?<><FiCheck className="mr-2"/>Added to bag</>:'Add estimate to bag'}</button><Link to={`/product/${product.id}`} className="mt-4 inline-flex text-xs underline">Check product details <FiArrowRight className="ml-2"/></Link></aside>
    </div>
  </div>;
}
