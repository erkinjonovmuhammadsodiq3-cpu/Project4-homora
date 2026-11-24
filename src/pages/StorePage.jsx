import {Link,useParams} from 'react-router-dom';
import {FiArrowLeft,FiArrowRight,FiCheckCircle,FiPackage} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import {Heading} from '../components/ui';
import {products} from '../data/products';

export function StorePage(){
  const {brand}=useParams();
  const sellerProducts=products.filter(product=>product.brand.toLowerCase()===brand.toLowerCase());
  const sellerName=sellerProducts[0]?.brand||brand;
  const categories=[...new Set(sellerProducts.map(product=>product.category))];
  const rating=sellerProducts.length?(sellerProducts.reduce((sum,product)=>sum+product.rating,0)/sellerProducts.length).toFixed(1):'—';
  return <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
    <Link to="/shop" className="mb-6 inline-flex items-center gap-2 text-xs text-stone hover:text-char"><FiArrowLeft/>Back to marketplace</Link>
    <section className="glass-panel relative overflow-hidden p-6 md:p-10">
      <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border border-accent/15"/>
      <p className="text-[10px] uppercase tracking-[.22em] text-accent">HOMORA MARKETPLACE · DEMO SELLER</p>
      <div className="relative mt-4 flex flex-wrap items-end justify-between gap-6">
        <div><h1 className="font-display text-5xl md:text-6xl">{sellerName}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-stone">Explore this supplier's listed home and building products, compare options, and add suitable pieces to your HOMORA project.</p></div>
        <div className="flex items-center gap-2 rounded-full border border-stone/50 px-4 py-2 text-xs"><FiCheckCircle className="text-accent"/>Catalog supplier profile</div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-stone/40 pt-5 sm:grid-cols-3">
        <div><p className="font-display text-3xl">{sellerProducts.length}</p><p className="text-xs text-stone">Catalog products</p></div>
        <div><p className="font-display text-3xl">★ {rating}</p><p className="text-xs text-stone">Average demo rating</p></div>
        <div className="col-span-2 sm:col-span-1"><p className="font-display text-xl">{categories.length?categories.join(' · '):'No listed categories'}</p><p className="text-xs text-stone">Product categories</p></div>
      </div>
    </section>
    <div className="my-6 flex items-start gap-3 rounded-xl border border-stone/40 p-4 text-xs leading-5 text-stone"><FiPackage className="mt-0.5 shrink-0 text-accent"/>Supplier identity, product ratings, origin, warranty and delivery information are illustrative demo data and have not been independently verified.</div>
    <section className="mt-10"><Heading k="Supplier catalog">{sellerName} collection</Heading>{sellerProducts.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{sellerProducts.map(product=><ProductCard key={product.id} p={product}/>)}</div>:<div className="border-y border-stone/40 py-8 text-sm text-stone">This demo supplier has no listed products yet. <Link to="/shop" className="underline">Browse all products <FiArrowRight className="inline"/></Link></div>}</section>
  </div>;
}
