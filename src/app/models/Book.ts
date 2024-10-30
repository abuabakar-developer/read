import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  title: String,
  authors: [String],
  description: String,
  categories: [String],
  thumbnail: String,
  publishedDate: String,
  pageCount: Number,
  averageRating: Number,
  ratingsCount: Number,
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model('Book', bookSchema);

export default Book;


