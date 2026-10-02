import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../store/slices/authSlice';
import axios from 'axios';
import { LogOut, User, MapPin, Package, Settings } from 'lucide-react';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('profile');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || '');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMessage('');
      return;
    }
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` // Note: Cookie-based auth usually doesn't need this, but added just in case
        },
        withCredentials: true
      };

      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        { id: userInfo._id, name, email, phone, password },
        config
      );
      
      dispatch(setCredentials(data));
      setMessage('Profile Updated Successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      setMessage('');
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                <div className="h-12 w-12 rounded-full bg-brand-900 text-white flex items-center justify-center text-xl font-bold">
                  {userInfo?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{userInfo?.name}</h3>
                  <p className="text-xs text-gray-500">{userInfo?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-brand-50 text-brand-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User size={18} /> <span>Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-brand-50 text-brand-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package size={18} /> <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'bg-brand-50 text-brand-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <MapPin size={18} /> <span>Saved Addresses</span>
                </button>
                {userInfo?.isAdmin && (
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Settings size={18} /> <span>Admin Dashboard</span>
                  </button>
                )}
                <button
                  onClick={logoutHandler}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut size={18} /> <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Personal Information</h2>
                {message && <div className="bg-green-50 text-green-600 p-3 rounded text-sm mb-6">{message}</div>}
                {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm mb-6">{error}</div>}
                
                <form onSubmit={submitHandler} className="max-w-xl space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900 bg-gray-50"
                        readOnly // Email change might require verification usually
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                    />
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-brand-900 focus:border-brand-900"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" className="bg-brand-900 text-white px-8 py-2 rounded font-medium hover:bg-brand-500 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">My Orders</h2>
                <div className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p>You haven't placed any orders yet.</p>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Saved Addresses</h2>
                <button className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full text-center hover:bg-gray-50 transition-colors text-brand-900 font-medium">
                  + Add New Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
