import dotenv from "dotenv";
dotenv.config(); // ← ADD THIS FIRST

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("CLOUDINARY:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✅" : "❌ MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "✅" : "❌ MISSING",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resource_type = "auto";
    if (file.mimetype.startsWith("image/"))      resource_type = "image";
    else if (file.mimetype.startsWith("video/")) resource_type = "video";
    else                                         resource_type = "raw";

    return {
      folder: "assignmenthub/submissions",
      resource_type,
      allowed_formats: ["pdf", "zip", "doc", "docx", "png", "jpg", "jpeg", "mp4"],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export { cloudinary, upload };
