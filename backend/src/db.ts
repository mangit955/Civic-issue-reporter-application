import mongoose, { model, Schema } from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL || "";
console.log("Attempting to connect to DB with URL:", DATABASE_URL);
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Connected to DB!"))
  .catch((err) => console.log("DB connection error:", err));

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
});

export const UserModel = model("User", UserSchema);

const AdminSchema = new Schema({
  username: { type: String, unique: true, require },
  password: String,
  email: String,
  fullname: String,
  phonenumber: String,
  department: String,
  position: String,
});

export const AdminModel = model("Admin", AdminSchema);

const IssueSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  location: String,
  status: Boolean,
  type: String,
  phonenumber: String,
  fullname: String,
  address: String,
});

export const IssueModel = model("Issue", IssueSchema);

const locationSchema = new Schema({
  address: String,
});

export const LocationModel = model("Location", locationSchema);
