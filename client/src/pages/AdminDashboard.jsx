import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const config = { withCredentials: true };
        const { data: usersData } = await axios.get('http://localhost:5000/api/users', config);
        const { data: ordersData } = await axios.get('http://localhost:5000/api/orders', config);
        const { data: productsData } = await axios.get('http://localhost:5000/api/products?pageSize=100', config);
        
        setUsers(usersData);
        setOrders(ordersData);
        setProducts(productsData.products || []);
      } catch (error) {
        console.error('Error fetching admin data', error);
      }
    };
    
    fetchData();
  }, [userInfo, navigate]);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-brand-50 text-brand-900 rounded-full"><ShoppingBag size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full"><Package size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-brand-900 font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">USER</th>
                  <th className="px-6 py-4 font-medium">DATE</th>
                  <th className="px-6 py-4 font-medium">TOTAL</th>
                  <th className="px-6 py-4 font-medium">PAID</th>
                  <th className="px-6 py-4 font-medium">DELIVERED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="text-sm text-gray-900 hover:bg-gray-50">
                    <td className="px-6 py-4">{order._id.substring(0, 8)}</td>
                    <td className="px-6 py-4">{order.user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">₹{order.totalPrice}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Yes</span> : <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">No</span>}
                    </td>
                    <td className="px-6 py-4">
                      {order.orderStatus === 'Delivered' ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Yes</span> : <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
