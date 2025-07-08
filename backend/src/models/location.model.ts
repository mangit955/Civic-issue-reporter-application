import { model, Schema } from "mongoose";

const locationSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: String,
});

export const LocationModel = model("Location", locationSchema);
