import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

export const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// Upload Function
export async function uploadFile({
  sourceFilePath,
  destinationFilePath,
  mimeType
}) {
  const fileData = fs.readFileSync(sourceFilePath);
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_Bucket_NAME,
      Key: destinationFilePath,
      Body: fileData,
      ContentType: mimeType,
    })
  );

  return key; // Path in S3
}

// Delete Function
export async function deleteFile(filePath) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_Bucket_NAME,
      Key: filePath,
    })
  );
}

// Move Function
export async function moveFile(sourceKey, destinationKey) {
  try {
    await s3.send(
      new CopyObjectCommand({
        Bucket: process.env.S3_Bucket_NAME,
        CopySource: `${process.env.S3_Bucket_NAME}/${sourceKey}`,
        Key: destinationKey,
      })
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_Bucket_NAME,
        Key: sourceKey,
      })
    );

    return destinationKey;
  } catch (error) {
    console.error("Failed to move file in S3:", error);
    throw error;
  }
}

// Get Signed URL Function
export async function getSignedImageUrl(storagePath) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_Bucket_NAME,
    Key: storagePath,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 }); // Expires in 1 hour
}
