import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CheckCircle, Truck, Package, CreditCard } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          withCredentials: true
        };
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching order');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, userInfo]);

  if (loading) return <div className="text-center py-20">Loading order details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-gray-900">Order #{order._id.substring(0, 8)}</h1>
              <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Package className="text-brand-900" />
                <h3 className="font-bold text-gray-900">Delivery Address</h3>
              </div>
              <p className="text-gray-600 text-sm">
                <span className="font-bold">{order.shippingAddress.fullName}</span><br />
                {order.shippingAddress.addressLine},<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.pincode}<br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="text-brand-900" />
                <h3 className="font-bold text-gray-900">Payment</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Method: {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="bg-orange-50 text-orange-700 px-3 py-2 rounded-md text-sm font-medium">
                  Not Paid
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Truck className="text-brand-900" />
                <h3 className="font-bold text-gray-900">Order Summary</h3>
              </div>
              <dl className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><dt>Items</dt><dd>₹{order.itemsPrice}</dd></div>
                <div className="flex justify-between"><dt>Shipping</dt><dd>₹{order.shippingPrice}</dd></div>
                <div className="flex justify-between"><dt>Tax</dt><dd>₹{order.taxPrice}</dd></div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t mt-2"><dt>Total</dt><dd>₹{order.totalPrice}</dd></div>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold font-serif text-gray-900 mb-6">Order Items</h2>
          <div className="divide-y divide-gray-200">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex py-6">
                <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-center">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900"><Link to={`/product/${item.product}`}>{item.name}</Link></h3>
                      <p className="mt-1 text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Qty: {item.qty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
