import mongoose, { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['LIKE', 'COMMENT', 'NEW_POST'], required: true },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.models.Notification || model('Notification', NotificationSchema);
export default Notification;
