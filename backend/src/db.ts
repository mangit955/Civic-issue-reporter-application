import mongoose, { model, Schema } from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL || "";
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to DB!"))
  .catch((err) => console.log("DB connection error:", err));

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
  phoneNumber: String,
  fullName: String,
  address: String,
});

export const UserModel = model("User", UserSchema);

const AdminSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
  fullName: String,
  phoneNumber: String,
  department: String,
  position: String,
});

export const AdminModel = model("Admin", AdminSchema);

const IssueSchema = new Schema({
  title: String,
  description: String,
  location: { type: String, unique: true },
  status: Boolean,
  type: String,
});

export const IssueModel = model("Issue", IssueSchema);

const locationSchema = new Schema({
  address: String,
});

export const LocationModel = model("Location", locationSchema);
