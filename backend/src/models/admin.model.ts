import { model, Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: [
        true,
        "Password Must Have Atleast one UpperCase, LowerCase and Number each",
      ],
      min: [8, "Must be at least 8 Character"],
    },
    email: { type: String, unique: true, required: true, lowercase: true },
    fullname: { type: String, required: true },
    phonenumber: {
      type: String,
      required: [true, "User phone number required"],
    },
    department: { type: String, required: true },
    position: { type: String, required: true },
  },
  { timestamps: true }
);

export const AdminModel = model("Admin", AdminSchema);
