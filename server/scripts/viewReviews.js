import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/reviewModel.js';

dotenv.config();

const viewReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lumora');
    const reviews = await Review.find({}).sort({ createdAt: -1 });

    console.log('\n======================================================');
    console.log(`  MONGODB REVIEWS COLLECTION (${reviews.length} Total Reviews)`);
    console.log('======================================================\n');

    if (reviews.length === 0) {
      console.log('No reviews found in the "reviews" collection.');
    } else {
      reviews.forEach((r, idx) => {
        console.log(`[#${idx + 1}] Review for: "${r.productName || r.product}"`);
        console.log(`     Reviewer: ${r.name}`);
        console.log(`     Rating:   ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)} (${r.rating}/5)`);
        if (r.title) console.log(`     Title:    "${r.title}"`);
        console.log(`     Comment:  "${r.comment}"`);
        if (r.image) console.log(`     Photo:    ${r.image}`);
        console.log(`     Date:     ${r.createdAt.toLocaleString()}`);
        console.log('------------------------------------------------------');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

viewReviews();
