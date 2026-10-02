import { Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button className="text-gray-600 hover:text-brand-900 focus:outline-none">
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-brand-900">
              LUMORA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link to="/men" className="text-sm font-medium text-gray-700 hover:text-brand-900 transition-colors">Men</Link>
            <Link to="/women" className="text-sm font-medium text-gray-700 hover:text-brand-900 transition-colors">Women</Link>
            <Link to="/kids" className="text-sm font-medium text-gray-700 hover:text-brand-900 transition-colors">Kids</Link>
            <Link to="/beauty" className="text-sm font-medium text-gray-700 hover:text-brand-900 transition-colors">Beauty</Link>
            <Link to="/accessories" className="text-sm font-medium text-gray-700 hover:text-brand-900 transition-colors">Accessories</Link>
          </nav>

          {/* Search bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md ml-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:border-brand-900 focus:ring-1 focus:ring-brand-900 sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6 ml-6">
            <Link to="/profile" className="text-gray-600 hover:text-brand-900 flex flex-col items-center">
              <User size={20} />
              <span className="text-[10px] mt-1 hidden sm:block font-medium">Profile</span>
            </Link>
            
            <Link to="/wishlist" className="text-gray-600 hover:text-brand-900 flex flex-col items-center relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
              <span className="text-[10px] mt-1 hidden sm:block font-medium">Wishlist</span>
            </Link>
            
            <Link to="/cart" className="text-gray-600 hover:text-brand-900 flex flex-col items-center relative">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
              <span className="text-[10px] mt-1 hidden sm:block font-medium">Bag</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
