import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configures Cloudinary with credentials from environment variables.
 * @see https://cloudinary.com/documentation/node_integration
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * Configures Cloudinary storage for Multer.
 * Uploads files to the "BookBazaar" folder with specific format and transformation rules.
 * @type {CloudinaryStorage}
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "BookBazaar",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 750, crop: "limit" }],
  },
});
/**
 * Multer middleware for handling single file uploads to Cloudinary.
 * @type {multer.Multer}
 */
const upload = multer({ storage });

export { upload, cloudinary };
