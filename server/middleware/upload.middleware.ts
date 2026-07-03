import multer from "multer";
import { ApiError } from "../utils/ApiError.ts";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(ApiError.badRequest("Only JPEG, PNG, WEBP, GIF, or SVG images are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("image");
