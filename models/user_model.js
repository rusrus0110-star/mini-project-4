import mongoose from "mongoose";
import bcrypt from "bcrypt";

const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

user_schema.pre("save", async function hash_password() {
  if (!this.isModified("password")) {
    return;
  }

  const salt_rounds = 12;

  this.password = await bcrypt.hash(this.password, salt_rounds);
});

user_schema.methods.compare_password = async function compare_password(
  candidate_password,
) {
  return bcrypt.compare(candidate_password, this.password);
};

const User = mongoose.model("User", user_schema);

export default User;
