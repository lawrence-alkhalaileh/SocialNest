"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const supportedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
//   "image/gif",
//   "image/webp",
//   "image/svg+xml",
];

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, message: "No file provided" };
    }

    if (!supportedImageTypes.includes(file.type)) {
      return { success: false, message: "Unsupported file type" };
    }

    let optimizedImage: Buffer;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === "image/svg+xml") {
      optimizedImage = buffer;
    } else {
      optimizedImage = await sharp(buffer)
        .resize(800, 400, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
    }

    const imageId = uuidv4();
    const fileExtension =
      file.name.split(".").pop()?.toLowerCase() ||
      (file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1] || "jpg");

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `${imageId}.${fileExtension}`,
      Body: optimizedImage,
      ContentType: file.type,
      Metadata: {
        "original-filename": file.name,
      },
    };

    await s3Client.send(new PutObjectCommand(params));
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    return { success: true, imageUrl };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to upload file" };
  }
}
