// models/Wishlist.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IWishlist extends Document {
  userId: string; // ID of the user who owns the wishlist
  bookIds: string[]; // Array of book IDs
}

const WishlistSchema: Schema = new Schema({
  userId: { type: String, required: true },
  bookIds: { type: [String], default: [] },
});

const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
