import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,       // No two users can share an email
      lowercase: true,    // Normalize before saving (Avoid "A@x.com" vs "a@x.com" duplicates)
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

// ---------- MIDDLEWARE (Mongoose hook) ----------
// Runs automatically BEFORE a user document is saved
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or being changed
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10); // 10 rounds = good balance of security/speed
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------- INSTANCE METHOD ----------
// Lets us call user.matchPassword('plaintext') anywhere we have a user doc
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;