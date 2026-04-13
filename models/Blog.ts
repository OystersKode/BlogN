import mongoose, { Schema, model, models } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: Object, required: true }, // TipTap JSON structure
  coverImage: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
  category: { type: String, default: 'General' },
  readingTime: { type: String },
  seoTitle: { type: String },
  seoDescription: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  coAuthors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isStaffPick: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for performance optimization
BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.index({ author: 1 });
BlogSchema.index({ isStaffPick: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ slug: 1 }, { unique: true });


const Blog = mongoose.models.Blog || model('Blog', BlogSchema);
export default Blog;
