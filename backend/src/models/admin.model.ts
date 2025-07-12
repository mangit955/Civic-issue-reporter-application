import { model, Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    fullname: { type: String, required: true },
    password: {
      type: String,
      required: [
        true,
        "Password Must Have Atleast one UpperCase, LowerCase and Number each",
      ],
      min: [8, "Must be at least 8 Character"],
    },
    email: { type: String, required: true, lowercase: true },
    phonenumber: {
      type: String,
      required: [true, "User phone number required"],
    },
    department: { type: String, required: true },
    position: { type: String, required: true },
    adminAccessCode: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

export const AdminModel = model("Admin", AdminSchema);
