// models/Wishlist.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IWishlist extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  books: string[];
}

const wishlistSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [{ type: String, ref: 'Book' }],
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', wishlistSchema);




