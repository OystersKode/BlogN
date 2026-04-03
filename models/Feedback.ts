import mongoose, { Schema, model, models } from 'mongoose';

const FeedbackSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: {
    speed: { type: Number, required: true, min: 1, max: 5 },
    editor: { type: Number, required: true, min: 1, max: 5 },
    upload: { type: Number, required: true, min: 1, max: 5 },
    mobile: { type: Number, required: true, min: 1, max: 5 },
  },
  comment: { type: String, default: "" },
}, { timestamps: true });

if (mongoose.models.Feedback) {
  delete mongoose.models.Feedback;
}
const Feedback = model('Feedback', FeedbackSchema);

export default Feedback;
