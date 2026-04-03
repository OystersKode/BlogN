import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  bio: { type: String, default: "" },
  prn: { type: String, default: "" },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  socials: {
    twitter: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
}, { timestamps: true });


if (mongoose.models.User) {
  delete mongoose.models.User;
}
const User = model('User', UserSchema);

export default User;
