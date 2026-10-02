import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { clearCartItems } from '../store/slices/cartSlice';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!cart.shippingAddress.addressLine) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    setError('');
    
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      };

      const orderData = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };

      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      dispatch(clearCartItems());
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Steps */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-8 text-sm font-medium">
          <div className="text-brand-900 border-b-2 border-brand-900 pb-1 cursor-pointer" onClick={() => navigate('/shipping')}>1. ADDRESS</div>
          <div className="text-brand-900 border-b-2 border-brand-900 pb-1 cursor-pointer" onClick={() => navigate('/payment')}>2. PAYMENT</div>
          <div className="text-brand-900 border-b-2 border-brand-900 pb-1">3. ORDER</div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold font-serif text-gray-900 mb-4">Shipping Address</h2>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{cart.shippingAddress.fullName}</span><br />
                {cart.shippingAddress.addressLine}, {cart.shippingAddress.city}<br />
                {cart.shippingAddress.state}, {cart.shippingAddress.pincode}<br />
                Phone: {cart.shippingAddress.phone}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold font-serif text-gray-900 mb-4">Payment Method</h2>
              <p className="text-gray-600 font-medium">{cart.paymentMethod}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold font-serif text-gray-900 mb-4">Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex py-4">
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col justify-center">
                        <Link to={`/product/${item.product}`} className="font-medium text-gray-900">{item.name}</Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.qty} x ₹{item.price} = <span className="font-bold text-gray-900">₹{item.qty * item.price}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 lg:col-span-4 lg:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold font-serif text-gray-900 mb-4">Order Summary</h2>
              
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Items</dt>
                  <dd className="text-sm font-medium text-gray-900">₹{cart.itemsPrice}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">₹{cart.shippingPrice}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-sm text-gray-600">Tax</dt>
                  <dd className="text-sm font-medium text-gray-900">₹{cart.taxPrice}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-gray-900">₹{cart.totalPrice}</dd>
                </div>
              </dl>

              {error && <div className="mt-4 bg-red-50 text-red-500 p-3 rounded text-sm">{error}</div>}

              <div className="mt-6">
                <button
                  type="button"
                  disabled={cart.cartItems.length === 0 || loading}
                  onClick={placeOrderHandler}
                  className="w-full rounded-md border border-transparent bg-brand-900 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-500 focus:outline-none transition-colors disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
