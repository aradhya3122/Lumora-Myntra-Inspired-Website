import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../store/slices/cartSlice';

const ShippingAddressPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');
  const [addressLine, setAddressLine] = useState(shippingAddress.addressLine || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [state, setState] = useState(shippingAddress.state || '');
  const [pincode, setPincode] = useState(shippingAddress.pincode || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ fullName, phone, addressLine, city, state, pincode }));
    navigate('/payment');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Steps */}
        <div className="flex items-center justify-between mb-8 text-sm font-medium">
          <div className="text-brand-900 border-b-2 border-brand-900 pb-1">1. ADDRESS</div>
          <div className="text-gray-400">2. PAYMENT</div>
          <div className="text-gray-400">3. ORDER</div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Delivery Address</h2>
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address (House No, Building, Street)</label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                className="bg-brand-900 text-white px-8 py-3 rounded font-medium hover:bg-brand-500 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressPage;
