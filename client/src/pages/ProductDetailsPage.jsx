import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        setLoading(false);
      } catch (err) {
        setError('Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...product,
      product: product._id,
      size: selectedSize,
      color: selectedColor,
      qty
    }));
    // Could show a toast here
  };

  const handleWishlist = () => {
    dispatch(addToWishlist(product));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white">
      <div className="pt-6 pb-16 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-400 hover:text-gray-500">Home</Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <Link to={`/${product.category.toLowerCase()}`} className="text-gray-400 hover:text-gray-500">
                {product.category}
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li className="text-sm">
              <span className="font-medium text-gray-500 hover:text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
            
            {/* Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24">
                {product.images?.map((img, idx) => (
                  <button key={idx} className="relative h-24 w-20 flex-shrink-0 rounded-md bg-white border border-gray-200 overflow-hidden hover:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900">
                    <img src={img} alt="" className="h-full w-full object-cover object-center" />
                  </button>
                ))}
              </div>
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative">
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-10 px-4 sm:px-0 lg:mt-0">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{product.brand}</h2>
              <h1 className="text-xl text-gray-500 mt-1">{product.name}</h1>

              <div className="mt-4 flex items-center border border-gray-200 w-fit px-3 py-1 rounded">
                <span className="font-bold text-sm mr-1">{product.rating}</span>
                <Star size={14} className="text-brand-900 fill-current" />
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500">{product.numReviews} Ratings</span>
              </div>

              <div className="mt-6 flex items-baseline space-x-3">
                <p className="text-3xl font-bold tracking-tight text-gray-900">₹{product.price}</p>
                {product.mrp > product.price && (
                  <>
                    <p className="text-xl text-gray-500 line-through">MRP ₹{product.mrp}</p>
                    <p className="text-lg font-medium text-orange-500">({product.discount}% OFF)</p>
                  </>
                )}
              </div>
              <p className="text-sm text-green-600 font-medium mt-1">inclusive of all taxes</p>

              {/* Select Color */}
              {product.colors?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <div className="mt-2 flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedColor === color ? 'border-brand-900 ring-1 ring-brand-900 text-brand-900' : 'border-gray-200 text-gray-900 hover:bg-gray-50'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Select Size */}
              {product.sizes?.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <button className="text-sm font-medium text-brand-900 hover:text-brand-500">Size Chart</button>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex items-center justify-center rounded-full border py-3 px-3 text-sm font-medium uppercase sm:flex-1 ${selectedSize === size ? 'border-brand-900 ring-1 ring-brand-900 bg-brand-50 text-brand-900' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {product.countInStock > 0 && (
                 <div className="mt-8 flex items-center space-x-4">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                  <select 
                    value={qty} 
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                 </div>
              )}

              <div className="mt-10 flex space-x-4">
                {product.countInStock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-brand-900 px-8 py-3 text-base font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 transition-colors"
                  >
                    ADD TO BAG
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center rounded-md border border-transparent bg-gray-300 px-8 py-3 text-base font-medium text-gray-500 cursor-not-allowed"
                  >
                    OUT OF STOCK
                  </button>
                )}
                <button
                  onClick={handleWishlist}
                  className="flex-1 flex items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 transition-colors"
                >
                  WISHLIST
                </button>
              </div>

              {/* Product Details Section */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <span>Product Details</span>
                </h3>
                <div className="mt-4 prose prose-sm text-gray-500">
                  <p>{product.description}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {product.material && (
                    <div>
                      <span className="font-medium text-gray-900 block">Material</span>
                      {product.material}
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <span className="font-medium text-gray-900 block">Care Instructions</span>
                      {product.careInstructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery info */}
              <div className="mt-8 border-t border-gray-200 pt-8 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Truck size={20} className="text-gray-400" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield size={20} className="text-gray-400" />
                  <span>30 Days Return</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
