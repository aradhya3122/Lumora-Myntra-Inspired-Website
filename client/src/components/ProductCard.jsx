import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="group relative block overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
        />
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 shadow-sm">
          <span className="font-bold">{product.rating}</span>
          <Star size={12} className="text-yellow-500 fill-current" />
          <span className="text-gray-500">| {product.numReviews}</span>
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition-colors"
        >
          <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{product.brand}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate">{product.name}</p>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-500 line-through">₹{product.mrp}</span>
          )}
        </div>
      </div>
      
      {/* Quick Add Button overlay on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/95 border-t border-gray-100">
        <button className="w-full flex items-center justify-center space-x-2 bg-brand-900 text-white py-2 rounded text-sm font-medium hover:bg-brand-500 transition-colors">
          <ShoppingBag size={16} />
          <span>Add to Bag</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
