import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative h-[60vh] bg-gray-900 rounded-2xl overflow-hidden mt-6">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
          alt="Fashion Sale"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Summer Collection</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Discover the latest trends in fashion and explore our new arrivals.</p>
          <button className="bg-white text-brand-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Men', 'Women', 'Kids', 'Beauty', 'Accessories'].map((cat) => (
            <div key={cat} className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-full overflow-hidden mb-3 border border-gray-200 group-hover:border-brand-900 transition-colors">
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 group-hover:bg-brand-50 transition-colors">
                  <span className="font-medium text-lg">{cat[0]}</span>
                </div>
              </div>
              <h3 className="text-center font-medium text-gray-800 group-hover:text-brand-900">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-serif font-bold">Trending Now</h2>
          <a href="/products" className="text-brand-900 font-medium hover:underline">View All</a>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
