import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import users from '../data/users.js';
import products from '../data/products.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Category from '../models/categoryModel.js';
import Review from '../models/reviewModel.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();

    // Hash passwords for seed users
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);

    const adminUser = createdUsers[0]._id;
    const customerUser = createdUsers[1] ? createdUsers[1]._id : adminUser;

    const sampleReviews = [
      {
        name: 'Ananya Sharma',
        rating: 5,
        title: 'Exceeded all expectations! Luxurious fabric.',
        comment: 'The quality of the material is exceptional. Fits true to size, feels breathable, and the color matches the pictures perfectly.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
        verified: true,
        user: customerUser,
      },
      {
        name: 'Rohan Mehra',
        rating: 4,
        title: 'Very stylish cut & great stitching',
        comment: 'Great everyday wear. The stitching is clean and durable. Delivered in just 2 days in premium packaging.',
        image: '',
        verified: true,
        user: adminUser,
      },
    ];

    const sampleProducts = products.map((product) => {
      return { 
        ...product, 
        user: adminUser,
        reviews: sampleReviews,
        numReviews: sampleReviews.length,
        rating: 4.5,
      };
    });

    const createdProducts = await Product.insertMany(sampleProducts);

    const allReviewsToInsert = [];
    createdProducts.forEach((prod) => {
      prod.reviews.forEach((rev) => {
        allReviewsToInsert.push({
          product: prod._id,
          productName: prod.name,
          user: rev.user,
          name: rev.name,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          image: rev.image,
          verified: rev.verified,
        });
      });
    });

    await Review.insertMany(allReviewsToInsert);

    const sampleCategories = [
      { name: 'Men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop' },
      { name: 'Women', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
      { name: 'Kids', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop' },
      { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' },
      { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop' },
    ];

    await Category.insertMany(sampleCategories);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
