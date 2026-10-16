import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  {
    name: 'Men',
    href: '/men',
    subtitle: 'Shirts, Blazers & More',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Women',
    href: '/women',
    subtitle: 'Dresses, Tops & Knits',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Kids',
    href: '/kids',
    subtitle: 'Denim, Sets & Hoodies',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Beauty',
    href: '/beauty',
    subtitle: 'Skincare & Cosmetics',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Accessories',
    href: '/accessories',
    subtitle: 'Bags, Watches & Boots',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner */}
      <section className="relative h-[65vh] min-h-[480px] bg-gray-950 rounded-3xl overflow-hidden mt-4 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Lumora Fashion Editorial"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-65 transform hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/40 to-transparent flex flex-col justify-center px-8 md:px-16 text-white max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 w-fit border border-white/20">
            <Sparkles size={14} className="text-amber-300" />
            <span>Autumn / Winter 2026 Collection</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold leading-tight tracking-tight mb-4">
            Elegance <br />
            <span className="italic font-light text-rose-200">Redefined.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-xl font-light leading-relaxed">
            Curated apparel, timeless tailoring, and luxury essentials crafted for every modern silhouette.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/women"
              className="bg-white text-gray-950 px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Shop Collection
            </Link>
            <Link
              to="/men"
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-white/20 transition-all duration-300"
            >
              Explore Men
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-y border-gray-100">
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50">
          <div className="p-3 bg-brand-50 text-brand-900 rounded-full">
            <Truck size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Complimentary Express Shipping</h4>
            <p className="text-xs text-gray-500">Free delivery on all orders over ₹999</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50">
          <div className="p-3 bg-brand-50 text-brand-900 rounded-full">
            <RotateCcw size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Hassle-Free 15-Day Returns</h4>
            <p className="text-xs text-gray-500">Instant doorstep pick-up & refunds</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50">
          <div className="p-3 bg-brand-50 text-brand-900 rounded-full">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">100% Certified Authentic</h4>
            <p className="text-xs text-gray-500">Curated directly from boutique designers</p>
          </div>
        </div>
      </section>

      {/* Shop By Category with Photographic Cards */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-900 mb-2">Curated Departments</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="group relative block overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <h3 className="font-serif text-xl font-bold tracking-wide group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-300 font-light mt-0.5">{cat.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seasonal Promo Split Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-72 rounded-2xl overflow-hidden shadow-md group">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"
            alt="Designer Spotlight"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/40 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-1">Exclusive Edit</span>
            <h3 className="text-2xl font-serif font-bold mb-2">The Designer Spotlight</h3>
            <p className="text-sm text-gray-200 mb-4 font-light">Explore statement couture and handcrafted silhouettes.</p>
            <Link to="/women" className="inline-flex items-center text-sm font-semibold hover:underline space-x-1">
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative h-72 rounded-2xl overflow-hidden shadow-md group">
          <img
            src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop"
            alt="Men's Essentials"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/40 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">Tailored Living</span>
            <h3 className="text-2xl font-serif font-bold mb-2">Modern Menswear</h3>
            <p className="text-sm text-gray-200 mb-4 font-light">Precision cuts, breathable linens, and Italian wool blazers.</p>
            <Link to="/men" className="inline-flex items-center text-sm font-semibold hover:underline space-x-1">
              <span>Shop Menswear</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-900 mb-1">Handpicked Favorites</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Trending Now</h2>
          </div>
          <Link
            to="/women"
            className="text-brand-900 font-semibold text-sm flex items-center space-x-1 hover:space-x-2 transition-all"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
