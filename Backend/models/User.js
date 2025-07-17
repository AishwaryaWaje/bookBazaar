import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, minlength: 3, maxlength: 30 },
  email: { type: String, require: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, require: true, minlength: 6 },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
export default User;
