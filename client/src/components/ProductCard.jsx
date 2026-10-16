import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || product.images?.[0] || FALLBACK_IMAGE);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        ...product,
        product: product._id,
        size: product.sizes?.[0] || 'Standard',
        color: product.colors?.[0] || 'Default',
        qty: 1,
      })
    );
  };

  const secondaryImage = product.images?.[1];

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative block overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={isHovered && secondaryImage ? secondaryImage : imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-cover w-full h-full transform transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] tracking-wider uppercase font-extrabold px-2 py-1 rounded shadow-sm">
            {product.discount}% OFF
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow-sm text-gray-800">
          <span>{product.rating}</span>
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span className="text-gray-400 font-normal">| {product.numReviews}</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-gray-600 hover:text-red-500 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110"
        >
          <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase truncate">{product.brand}</h3>
        <p className="text-sm text-gray-500 truncate mt-0.5">{product.name}</p>

        <div className="flex items-center space-x-2.5 mt-2">
          <span className="text-base font-bold text-gray-900">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
          )}
          {product.discount > 0 && (
            <span className="text-xs font-semibold text-red-500">({product.discount}% OFF)</span>
          )}
        </div>
      </div>

      {/* Quick Add Button overlay on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={handleQuickAdd}
          className="w-full flex items-center justify-center space-x-2 bg-brand-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-500 shadow-md transition-colors"
        >
          <ShoppingBag size={16} />
          <span>Quick Add to Bag</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
