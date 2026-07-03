import { cloudinary, cloudinaryConfigured } from "../config/cloudinary.ts";
import { ApiError } from "./ApiError.ts";

export function uploadBufferToCloudinary(buffer: Buffer, folder = "bank-cms"): Promise<{ url: string; publicId: string }> {
  if (!cloudinaryConfigured) {
    throw ApiError.internal("Image uploads are not configured. Set CLOUDINARY_* environment variables.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(ApiError.internal(`Image upload failed: ${error?.message ?? "unknown error"}`));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}
