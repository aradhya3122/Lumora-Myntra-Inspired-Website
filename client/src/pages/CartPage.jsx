import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const removeFromCartHandler = (id, size, color) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif mb-8">Shopping Bag</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Hey, it feels so light!</h2>
            <p className="text-gray-500 mb-6">There is nothing in your bag. Let's add some items.</p>
            <Link
              to="/wishlist"
              className="inline-block px-8 py-3 bg-brand-900 text-white rounded font-medium hover:bg-brand-500 transition-colors"
            >
              ADD ITEMS FROM WISHLIST
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-8">
              <div className="border-t border-gray-200 divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex py-6">
                    <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </h3>
                          <p className="ml-4 text-sm font-bold text-gray-900">₹{item.price}</p>
                        </div>
                        <div className="mt-1 flex text-sm text-gray-500 space-x-4">
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded">
                          <select
                            value={item.qty}
                            onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                            className="bg-transparent pl-2 pr-6 py-1 text-sm focus:outline-none"
                          >
                            {[...Array(10).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>{x + 1}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCartHandler(item._id, item.size, item.color)}
                          className="text-sm font-medium text-red-500 hover:text-red-400 flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">₹{itemsPrice}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {shippingPrice === 0 ? <span className="text-green-600">Free</span> : `₹${shippingPrice}`}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate (15%)</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">₹{taxPrice}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">₹{totalPrice}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={checkoutHandler}
                  className="w-full rounded-md border border-transparent bg-brand-900 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
