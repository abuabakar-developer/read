// models/Author.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  bio?: string; // Optional field for author's biography
}

const AuthorSchema: Schema = new Schema({
  name: { type: String, required: true },
  bio: { type: String },
});

// Ensure the model is only created once
const Author = mongoose.models.Author || mongoose.model<IAuthor>('Author', AuthorSchema);

export default Author;


