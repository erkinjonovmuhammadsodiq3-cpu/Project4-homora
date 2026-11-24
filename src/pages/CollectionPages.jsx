import {Link} from 'react-router-dom';
import {FiArrowRight} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import {Heading} from '../components/ui';
import {products} from '../data/products';

const collections={
  Exterior:{
    eyebrow:'OUTDOOR LIVING · FACADE · POOL',
    title:'The home continues outside.',
    description:'Plan the facade, roofline, windows, garden and pool as one connected part of your home.',
    categories:['Roofing & Drainage','Windows & Doors','Insulation & Waterproofing','Outdoor','Garden','Pool']
  },
  Garden:{
    eyebrow:'GARDEN · TERRACE · WATER',
    title:'Make the outdoors part of home.',
    description:'Build a garden plan with lighting, seating, irrigation and pool essentials chosen to work together.',
    categories:['Garden','Outdoor','Pool','Lighting']
  }
};

export function HomeCollection({kind='Exterior'}){
  const collection=collections[kind]||collections.Exterior;
  const selection=products.filter(product=>collection.categories.includes(product.category));
  const hero=selection[0]||products[0];
  return <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
    <section className="grid overflow-hidden bg-char text-warm md:grid-cols-2"><div className="flex flex-col justify-center p-7 md:p-12"><p className="text-[10px] uppercase tracking-[.2em] text-beige">{collection.eyebrow}</p><h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">{collection.title}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-warm/75">{collection.description}</p><Link to="/design" className="btn mt-6 w-fit border-warm">Plan this space <FiArrowRight className="ml-2"/></Link></div><img src={hero.image} alt={`${kind} home inspiration`} className="aspect-[4/3] h-full w-full object-cover md:aspect-auto"/></section>
    <nav className="my-8 flex gap-2 overflow-x-auto pb-2" aria-label={`${kind} categories`}>{collection.categories.map(category=><Link key={category} to={`/shop/${encodeURIComponent(category)}`} className="shrink-0 rounded-full border border-stone/60 px-4 py-2 text-xs transition hover:border-char">{category}</Link>)}</nav>
    <Heading k={`${kind} collection`}>Everything to finish the space.</Heading>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{selection.map(product=><ProductCard key={product.id} p={product}/>)}</div>
    <section className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-stone/50 pt-6"><div><p className="text-xs text-stone">Need the whole project, not one category?</p><h2 className="mt-1 font-display text-3xl">Build your home from the ground up.</h2></div><Link to="/build" className="btn btn-dark">Start a project <FiArrowRight className="ml-2"/></Link></section>
  </div>;
}
