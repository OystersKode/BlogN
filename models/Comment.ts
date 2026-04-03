import { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;
