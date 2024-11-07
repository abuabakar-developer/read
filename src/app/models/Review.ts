// models/Review.ts
import mongoose, { Schema, Document } from "mongoose";

// Define the Review schema
interface IReview extends Document {
  bookId: string;
  user: string;
  comment: string;
  rating: number;
}

const reviewSchema = new Schema<IReview>({
  bookId: { type: String, required: true },
  user: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
});

// Create the Review model
const Review = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
