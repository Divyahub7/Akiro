import cloudinary from "../config/cloudinary.js";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import streamifier from "streamifier";

/**
 * Upload a file buffer to Cloudinary
 */
export const uploadToCloudinary = (buffer, folder = "akiro", resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Upload avatar image to Cloudinary
 */
export const uploadAvatar = (buffer) => {
  return uploadToCloudinary(buffer, "akiro/avatars", "image");
};

/**
 * Upload resume PDF to Cloudinary
 */
export const uploadResumePDF = (buffer) => {
  return uploadToCloudinary(buffer, "akiro/resumes", "raw");
};

/**
 * Delete a file from Cloudinary by public ID
 */
export const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

/**
 * Parse text content from a PDF buffer
 */
export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    throw new Error("Failed to parse PDF: " + err.message);
  }
};
