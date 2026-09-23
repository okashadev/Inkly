import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function getCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split("/");
    const folderAndFileName = parts.slice(-2).join("/");
    return folderAndFileName.split(".")[0];
  } catch {
    return null;
  }
}

export default cloudinary;
