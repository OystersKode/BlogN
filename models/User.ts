import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  bio: { type: String, default: "" },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  socials: {
    twitter: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },
  },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
