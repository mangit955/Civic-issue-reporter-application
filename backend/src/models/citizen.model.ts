import { Schema, model } from "mongoose";

const CitizenSchema = new Schema(
  {
    fullName: { type: String, required: true },
    password: {
      type: String,
      required: [
        true,
        "Password Must Have Atleast one UpperCase, LowerCase and Number each",
      ],
      min: [8, "Must be at least 8 Character"],
    },
    email: { type: String, unique: true, required: true, lowercase: true },
    phonenumber: {
      type: String,
      required: [true, "User phone number required"],
    },
  },
  { timestamps: true }
);

export const CitizenModel = model("Citizen", CitizenSchema);
