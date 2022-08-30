const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const autoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: true },
    email_id: { type: String, required: true, index: { background: true, unique: true } },
    password: { type: String, required: true },
    user_name: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    mobile: { type: String, required: true, unique: true },
    status: { type: String, enum: ["public", "private"], default: "public" },
    followers: [{ type: String, ref: "user" }],
    following: [{ type: String, ref: "user" }],
    lastlogin: { type: Date },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    token: { type: String, default:"" }
  },
  {
    timestamps: true,
    _id: false,
  }
);

UserSchema.plugin(autoIncrement);

const User = model("User", UserSchema);
module.exports = User;
