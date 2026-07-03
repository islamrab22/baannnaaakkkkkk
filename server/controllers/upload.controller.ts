import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.ts";
import { ApiError } from "../utils/ApiError.ts";
import { recordAudit } from "../utils/audit.ts";

export const uploadController = {
  uploadImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest("No image file provided");
    const result = await uploadBufferToCloudinary(req.file.buffer, (req.body?.folder as string) || "bank-cms");
    await recordAudit(req, "UPLOAD", "Image", result.publicId);
    res.status(201).json(result);
  }),
};
