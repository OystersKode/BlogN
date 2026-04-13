import { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

CommentSchema.index({ blog: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;
