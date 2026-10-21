import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, Truck, Shield, ArrowLeft, Camera, UploadCloud, 
  CheckCircle, ThumbsUp, X, MessageSquare, AlertCircle, Image as ImageIcon, Check 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';

const RATING_LABELS = {
  1: 'Poor 😞',
  2: 'Fair 😐',
  3: 'Good 🙂',
  4: 'Very Good 😊',
  5: 'Excellent! 🌟',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  // Review Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setActiveImage(data.image || data.images?.[0] || FALLBACK_IMG);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        setLoading(false);
      } catch (err) {
        setError('Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...product,
      product: product._id,
      size: selectedSize,
      color: selectedColor,
      qty
    }));
  };

  const handleWishlist = () => {
    dispatch(addToWishlist(product));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setReviewError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result);
        setReviewError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      setReviewError('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      setReviewError('Please write your review comment');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token || ''}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating, title, comment, image: reviewImage },
        config
      );

      setReviewSuccess(data.message || 'Review submitted successfully!');
      setTitle('');
      setComment('');
      setReviewImage('');
      setRating(5);

      // Re-fetch product to update ratings and reviews list
      const { data: updatedProduct } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(updatedProduct);

      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess('');
      }, 2000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleHelpful = (reviewId) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  const reviews = product.reviews || [];

  // Calculate rating distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingCounts[rounded] = (ratingCounts[rounded] || 0) + 1;
  });

  const totalReviewsCount = reviews.length;

  // Filter reviews
  const filteredReviews = reviews.filter(r => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'photos') return Boolean(r.image);
    return Math.round(r.rating) === Number(selectedFilter);
  });

  // Extract photos from reviews
  const customerPhotos = reviews.filter(r => Boolean(r.image)).map(r => ({
    url: r.image,
    name: r.name,
    rating: r.rating,
    comment: r.comment
  }));

  return (
    <div className="bg-white">
      <div className="pt-6 pb-16 sm:pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-400 hover:text-gray-500">Home</Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li>
              <Link to={`/${product.category.toLowerCase()}`} className="text-gray-400 hover:text-gray-500">
                {product.category}
              </Link>
            </li>
            <li>
              <span className="text-gray-300">/</span>
            </li>
            <li className="text-sm">
              <span className="font-medium text-gray-500 hover:text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
            
            {/* Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 pb-2 lg:pb-0">
                {(product.images && product.images.length > 0 ? product.images : [activeImage]).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative h-24 w-20 flex-shrink-0 rounded-xl bg-white border-2 overflow-hidden transition-all duration-200 ${
                      activeImage === img ? 'border-brand-900 shadow-md ring-1 ring-brand-900' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
              <div className="w-full aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
                <img
                  src={activeImage || product.image || FALLBACK_IMG}
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                  className="h-full w-full object-cover object-center transition-all duration-300"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-10 px-4 sm:px-0 lg:mt-0">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{product.brand}</h2>
              <h1 className="text-xl text-gray-500 mt-1">{product.name}</h1>

              {/* Rating link to scroll to reviews */}
              <a 
                href="#reviews-section" 
                className="mt-4 inline-flex items-center border border-gray-200 hover:border-brand-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
              >
                <span className="font-bold text-sm mr-1.5 text-gray-900">{product.rating}</span>
                <Star size={14} className="text-amber-500 fill-amber-500 mr-2" />
                <span className="text-gray-300 mr-2">|</span>
                <span className="text-sm text-gray-600 group-hover:text-brand-900 font-medium">
                  {product.numReviews} Verified Reviews
                </span>
              </a>

              <div className="mt-6 flex items-baseline space-x-3">
                <span className="text-3xl font-bold tracking-tight text-gray-900">₹{product.price}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      ({product.discount}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-green-700 font-medium mt-1">Inclusive of all taxes</p>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <div className="mt-2 flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${selectedColor === color ? 'border-brand-900 bg-brand-50 text-brand-900' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <button className="text-sm font-medium text-brand-900 hover:text-brand-500">Size Chart</button>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex items-center justify-center rounded-full border py-3 px-3 text-sm font-medium uppercase sm:flex-1 ${selectedSize === size ? 'border-brand-900 ring-1 ring-brand-900 bg-brand-50 text-brand-900' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {product.countInStock > 0 && (
                 <div className="mt-8 flex items-center space-x-4">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                  <select 
                    value={qty} 
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:border-brand-900 focus:outline-none"
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                 </div>
              )}

              <div className="mt-10 flex space-x-4">
                {product.countInStock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center rounded-xl border border-transparent bg-brand-900 px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-500 shadow-md hover:shadow-lg transition-all"
                  >
                    ADD TO BAG
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center rounded-xl border border-transparent bg-gray-300 px-8 py-3.5 text-base font-semibold text-gray-500 cursor-not-allowed"
                  >
                    OUT OF STOCK
                  </button>
                )}
                <button
                  onClick={handleWishlist}
                  className="flex-1 flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  WISHLIST
                </button>
              </div>

              {/* Product Details Section */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <span>Product Details</span>
                </h3>
                <div className="mt-4 prose prose-sm text-gray-600 leading-relaxed">
                  <p>{product.description}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {product.material && (
                    <div>
                      <span className="font-semibold text-gray-900 block mb-1">Material</span>
                      {product.material}
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <span className="font-semibold text-gray-900 block mb-1">Care Instructions</span>
                      {product.careInstructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery info */}
              <div className="mt-8 border-t border-gray-200 pt-6 flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2.5">
                  <Truck size={20} className="text-brand-900" />
                  <span>Free Delivery Over ₹999</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Shield size={20} className="text-brand-900" />
                  <span>15 Days Return</span>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* CUSTOMER RATINGS & REVIEWS MODULE                        */}
          {/* ======================================================== */}
          <section id="reviews-section" className="mt-20 pt-12 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-900">Customer Feedback</span>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mt-1">Ratings & Customer Reviews</h2>
              </div>
              <button
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  setReviewError('');
                  setReviewSuccess('');
                }}
                className="bg-brand-900 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-brand-500 transition-colors shadow-sm flex items-center space-x-2"
              >
                <MessageSquare size={16} />
                <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Ratings Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-gray-50/75 border border-gray-200/80 rounded-2xl p-6 md:p-8 mb-12">
              {/* Overall Score */}
              <div className="md:col-span-4 flex flex-col justify-center items-center md:border-r border-gray-200 md:pr-8 text-center">
                <div className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center">
                  <span>{product.rating}</span>
                  <span className="text-2xl text-gray-400 font-normal ml-1">/ 5</span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= Math.round(product.rating)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Based on {totalReviewsCount} {totalReviewsCount === 1 ? 'customer review' : 'customer reviews'}
                </p>
                <div className="mt-3 inline-flex items-center space-x-1.5 text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-medium">
                  <CheckCircle size={14} />
                  <span>100% Verified Purchases</span>
                </div>
              </div>

              {/* Breakdown Distribution Bars */}
              <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingCounts[stars] || 0;
                  const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center text-sm">
                      <span className="w-12 font-medium text-gray-700 flex items-center space-x-1">
                        <span>{stars}</span>
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                      </span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-16 text-right text-xs text-gray-500 font-medium">
                        {percentage}% ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Photos Carousel/Strip */}
            {customerPhotos.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center space-x-2 mb-4">
                  <Camera size={18} className="text-brand-900" />
                  <h3 className="font-semibold text-gray-900 text-base">Customer Photos ({customerPhotos.length})</h3>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-3">
                  {customerPhotos.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxImage(photo.url)}
                      className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group border border-gray-200 shadow-sm"
                    >
                      <img
                        src={photo.url}
                        alt="Customer review"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        View
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Review Form */}
            {showReviewForm && (
              <div className="bg-white border-2 border-brand-900/20 rounded-2xl p-6 sm:p-8 mb-12 shadow-md transition-all">
                {!userInfo ? (
                  <div className="text-center py-8">
                    <AlertCircle size={36} className="text-brand-900 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Please Sign In</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                      You must be signed in to submit a rating and customer review for this product.
                    </p>
                    <Link
                      to={`/login?redirect=/product/${id}`}
                      className="bg-brand-900 text-white px-8 py-2.5 rounded-full font-medium text-sm hover:bg-brand-500 transition-colors inline-block"
                    >
                      Sign In Now
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="text-xl font-bold font-serif text-gray-900">Write a Customer Review</h3>
                      <p className="text-xs text-gray-500 mt-1">Share your honest feedback to help other fashion shoppers.</p>
                    </div>

                    {reviewSuccess && (
                      <div className="flex items-center space-x-2 bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-200">
                        <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                        <span>{reviewSuccess}</span>
                      </div>
                    )}

                    {reviewError && (
                      <div className="flex items-center space-x-2 bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-200">
                        <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                        <span>{reviewError}</span>
                      </div>
                    )}

                    {/* Star Rating Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Overall Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1" onMouseLeave={() => setHoverRating(0)}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              className="p-1 focus:outline-none transition-transform hover:scale-125"
                            >
                              <Star
                                size={28}
                                className={
                                  star <= (hoverRating || rating)
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-gray-300'
                                }
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-800 ml-3">
                          {RATING_LABELS[hoverRating || rating]}
                        </span>
                      </div>
                    </div>

                    {/* Headline / Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                        Review Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stunning fit, premium luxury fabric!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-900 text-sm"
                      />
                    </div>

                    {/* Review Comments */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                        Detailed Review <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="What did you like or dislike? How does the material, size, and silhouette feel?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-900 text-sm"
                        required
                      ></textarea>
                    </div>

                    {/* Upload Review Photo */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                        Attach Product Photo (Optional)
                      </label>
                      <p className="text-xs text-gray-500 mb-3">Upload a real photo of the garment or accessory.</p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="cursor-pointer inline-flex items-center space-x-2 border border-gray-300 hover:border-brand-900 bg-white px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 transition-colors shadow-sm">
                          <UploadCloud size={18} className="text-brand-900" />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>

                        <span className="text-xs text-gray-400">or enter image link:</span>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={typeof reviewImage === 'string' && reviewImage.startsWith('http') ? reviewImage : ''}
                          onChange={(e) => setReviewImage(e.target.value)}
                          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-brand-900"
                        />
                      </div>

                      {/* Photo Preview */}
                      {reviewImage && (
                        <div className="mt-4 relative inline-block rounded-xl overflow-hidden border border-gray-300 shadow-md">
                          <img
                            src={reviewImage}
                            alt="Upload preview"
                            className="h-28 w-28 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setReviewImage('')}
                            className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-brand-900 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-brand-500 shadow-md disabled:bg-gray-400 transition-colors flex items-center space-x-2"
                      >
                        {submittingReview ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Review</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Filter Tabs */}
            {reviews.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-200 pb-4">
                <span className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wider">Filter:</span>
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedFilter === 'all' ? 'bg-brand-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All ({reviews.length})
                </button>
                {customerPhotos.length > 0 && (
                  <button
                    onClick={() => setSelectedFilter('photos')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 transition-colors ${selectedFilter === 'photos' ? 'bg-brand-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Camera size={13} />
                    <span>With Photos ({customerPhotos.length})</span>
                  </button>
                )}
                {[5, 4, 3, 2, 1].map((s) => {
                  const cnt = ratingCounts[s] || 0;
                  if (cnt === 0) return null;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedFilter(String(s))}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 transition-colors ${selectedFilter === String(s) ? 'bg-brand-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <span>{s}</span>
                      <Star size={11} className="fill-current" />
                      <span>({cnt})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Reviews Feed */}
            {filteredReviews.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <MessageSquare size={36} className="text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-900">
                  {reviews.length === 0 ? 'No customer reviews yet' : 'No reviews match your filter'}
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-5">
                  {reviews.length === 0
                    ? 'Be the first to review this product and share your experience with other shoppers!'
                    : 'Try selecting a different filter above.'}
                </p>
                {reviews.length === 0 && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-brand-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-brand-500 transition-colors"
                  >
                    Write the First Review
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((rev, index) => {
                  const revId = rev._id || index;
                  const isHelpful = helpfulVotes[revId];
                  return (
                    <div
                      key={revId}
                      className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-900 font-bold flex items-center justify-center text-sm border border-brand-200">
                            {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <Check size={11} />
                                <span>Verified Buyer</span>
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'Recent Purchase'}
                            </span>
                          </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                          <span className="text-xs font-bold text-gray-900">{rev.rating}</span>
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                        </div>
                      </div>

                      {/* Review Title */}
                      {rev.title && (
                        <h5 className="font-bold text-gray-900 text-base mb-1.5">{rev.title}</h5>
                      )}

                      {/* Review Comment */}
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">{rev.comment}</p>

                      {/* Uploaded Review Image */}
                      {rev.image && (
                        <div className="mb-4">
                          <img
                            src={rev.image}
                            alt="Customer photo"
                            onClick={() => setLightboxImage(rev.image)}
                            className="h-28 w-28 rounded-xl object-cover cursor-pointer border border-gray-200 hover:opacity-90 shadow-sm transition-opacity"
                          />
                        </div>
                      )}

                      {/* Helpful Button */}
                      <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <button
                          onClick={() => toggleHelpful(revId)}
                          className={`flex items-center space-x-1.5 transition-colors ${isHelpful ? 'text-brand-900 font-bold' : 'hover:text-gray-900'}`}
                        >
                          <ThumbsUp size={14} className={isHelpful ? 'fill-brand-900' : ''} />
                          <span>Helpful ({isHelpful ? 1 : 0})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Lightbox Modal for Customer Review Photos */}
            {lightboxImage && (
              <div
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <div className="relative max-w-3xl max-h-[90vh] bg-transparent">
                  <button
                    onClick={() => setLightboxImage(null)}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                  >
                    <X size={28} />
                  </button>
                  <img
                    src={lightboxImage}
                    alt="Enlarged review photo"
                    className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain"
                  />
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
