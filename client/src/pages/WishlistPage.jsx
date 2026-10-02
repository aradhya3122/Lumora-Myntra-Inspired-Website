import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag } from 'lucide-react';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif mb-2">My Wishlist</h1>
        <p className="text-gray-500 mb-8">{wishlistItems.length} items</p>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-lg">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items that you like in your wishlist. Review them anytime and easily move them to the bag.</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 border border-brand-900 text-brand-900 rounded font-medium hover:bg-brand-900 hover:text-white transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="relative group">
                <ProductCard product={item} />
                <button
                  onClick={() => dispatch(removeFromWishlist(item._id))}
                  className="absolute top-2 left-2 p-2 bg-white rounded-full shadow hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors z-10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
