import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Online Shopping</h3>
            <ul className="space-y-3">
              <li><Link to="/men" className="text-sm text-gray-500 hover:text-brand-900">Men</Link></li>
              <li><Link to="/women" className="text-sm text-gray-500 hover:text-brand-900">Women</Link></li>
              <li><Link to="/kids" className="text-sm text-gray-500 hover:text-brand-900">Kids</Link></li>
              <li><Link to="/beauty" className="text-sm text-gray-500 hover:text-brand-900">Beauty</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Customer Policies</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-brand-900">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-500 hover:text-brand-900">FAQ</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-500 hover:text-brand-900">T&C</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-brand-900">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Experience Lumora App on Mobile</h3>
            <div className="flex space-x-4 mb-6">
              <div className="bg-black text-white px-4 py-2 rounded flex items-center cursor-pointer hover:bg-gray-800">
                <span className="text-sm font-medium">Get it on Google Play</span>
              </div>
              <div className="bg-black text-white px-4 py-2 rounded flex items-center cursor-pointer hover:bg-gray-800">
                <span className="text-sm font-medium">Download on App Store</span>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Keep In Touch</h3>
              <p className="text-sm text-gray-500 mb-4">Subscribe to our newsletter to get updates on our latest offers!</p>
              <form className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-900"
                />
                <button type="submit" className="bg-brand-900 text-white px-6 py-2 rounded-r-md hover:bg-brand-500 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Lumora. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 font-bold text-lg">LUMORA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
