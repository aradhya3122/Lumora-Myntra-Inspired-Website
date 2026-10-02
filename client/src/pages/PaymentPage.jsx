import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../store/slices/cartSlice';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shippingAddress.addressLine) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Steps */}
        <div className="flex items-center justify-between mb-8 text-sm font-medium">
          <div className="text-brand-900 border-b-2 border-brand-900 pb-1 cursor-pointer" onClick={() => navigate('/shipping')}>1. ADDRESS</div>
          <div className="text-brand-900 border-b-2 border-brand-900 pb-1">2. PAYMENT</div>
          <div className="text-gray-400">3. ORDER</div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Payment Method</h2>
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-brand-900 focus:ring-brand-900 border-gray-300"
                />
                <div className="ml-4">
                  <span className="block text-sm font-medium text-gray-900">Cash on Delivery (COD)</span>
                  <span className="block text-sm text-gray-500">Pay when your order is delivered.</span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit / Debit Card (Demo)"
                  checked={paymentMethod === 'Credit / Debit Card (Demo)'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-brand-900 focus:ring-brand-900 border-gray-300"
                />
                <div className="ml-4">
                  <span className="block text-sm font-medium text-gray-900">Credit / Debit Card (Demo)</span>
                  <span className="block text-sm text-gray-500">Demo mode. No real transaction will occur.</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI (Demo)"
                  checked={paymentMethod === 'UPI (Demo)'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-brand-900 focus:ring-brand-900 border-gray-300"
                />
                <div className="ml-4">
                  <span className="block text-sm font-medium text-gray-900">UPI (Demo)</span>
                  <span className="block text-sm text-gray-500">Demo mode. Pay via Google Pay, PhonePe, Paytm, etc.</span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                className="bg-brand-900 text-white px-8 py-3 rounded font-medium hover:bg-brand-500 transition-colors"
              >
                Continue to Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
