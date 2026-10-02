import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const category = location.pathname.substring(1); // e.g. "/men" -> "men"
  
  // Format category string (capitalize first letter)
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products?category=${categoryTitle}`);
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryTitle]);

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">{categoryTitle} Clothing</h1>
          <p className="mt-1 text-sm text-gray-500"><span className="font-bold">{products.length}</span> items</p>
        </div>
        
        <div className="flex items-center">
          <div className="relative inline-block text-left">
            <select className="border-gray-300 rounded-md text-sm py-2 pl-3 pr-8 focus:border-brand-900 focus:outline-none focus:ring-brand-900 cursor-pointer hover:bg-gray-50">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Better Discount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="border border-gray-200 rounded-lg bg-white p-5 sticky top-24">
            <h2 className="text-lg font-bold mb-4">FILTERS</h2>
            
            <div className="mb-6 border-b pb-4">
              <h3 className="font-medium text-sm mb-3">BRAND</h3>
              <div className="space-y-2">
                {['Lumora Basics', 'Lumora Premium', 'Lumora Kids', 'Lumora Beauty'].map(brand => (
                  <label key={brand} className="flex items-center cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-900 focus:ring-brand-900" />
                    <span className="ml-2 text-sm text-gray-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 border-b pb-4">
              <h3 className="font-medium text-sm mb-3">PRICE</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-900 focus:ring-brand-900" />
                  <span className="ml-2 text-sm text-gray-600">Rs. 500 to Rs. 1000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-900 focus:ring-brand-900" />
                  <span className="ml-2 text-sm text-gray-600">Rs. 1000 to Rs. 2000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-900 focus:ring-brand-900" />
                  <span className="ml-2 text-sm text-gray-600">Rs. 2000 to Rs. 4000</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-3">DISCOUNT RANGE</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="discount" className="border-gray-300 text-brand-900 focus:ring-brand-900" />
                  <span className="ml-2 text-sm text-gray-600">10% and above</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="discount" className="border-gray-300 text-brand-900 focus:ring-brand-900" />
                  <span className="ml-2 text-sm text-gray-600">20% and above</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="discount" className="border-gray-300 text-brand-900 focus:ring-brand-900" />
                  <span className="ml-2 text-sm text-gray-600">30% and above</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="animate-pulse">
                   <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
               ))}
             </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <h2 className="text-2xl font-serif text-gray-500">No products found in this category.</h2>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
