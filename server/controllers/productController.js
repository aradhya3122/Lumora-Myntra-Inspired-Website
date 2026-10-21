import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};

  const count = await Product.countDocuments({ ...keyword, ...category, ...brand });
  const products = await Product.find({ ...keyword, ...category, ...brand })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    mrp: 0,
    discount: 0,
    user: req.user._id,
    images: ['/images/sample.jpg'],
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    sizes: [],
    colors: [],
    material: '',
    careInstructions: '',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    mrp,
    discount,
    description,
    images,
    brand,
    category,
    countInStock,
    sizes,
    colors,
    material,
    careInstructions,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.mrp = mrp;
    product.discount = discount;
    product.description = description;
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.sizes = sizes;
    product.colors = colors;
    product.material = material;
    product.careInstructions = careInstructions;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create or update product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, title, image } = req.body;

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    res.status(400);
    throw new Error('Please select a star rating between 1 and 5');
  }

  if (!comment || comment.trim() === '') {
    res.status(400);
    throw new Error('Please enter a review comment');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment.trim();
      if (title !== undefined) alreadyReviewed.title = title.trim();
      if (image !== undefined) alreadyReviewed.image = image;
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        title: title ? title.trim() : '',
        comment: comment.trim(),
        image: image || '',
        verified: true,
        user: req.user._id,
      };

      product.reviews.unshift(review);
    }

    product.numReviews = product.reviews.length;

    const totalRatings = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = Number((totalRatings / product.reviews.length).toFixed(1));

    await product.save();

    res.status(201).json({
      message: alreadyReviewed ? 'Review updated successfully!' : 'Review submitted successfully!',
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(8);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
