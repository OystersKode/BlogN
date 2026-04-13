import mongoose, { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['LIKE', 'COMMENT', 'NEW_POST', 'FOLLOW'], required: true },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: false },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ sender: 1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;
