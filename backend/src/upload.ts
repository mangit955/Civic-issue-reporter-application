import multer from "multer";
import { storage } from "./cloudinary";

export const upload = multer({ storage });
