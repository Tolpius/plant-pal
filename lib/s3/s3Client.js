import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT, 
  forcePathStyle: true, 
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export async function getSignedImageUrl(imageStoragePath) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_Bucket_NAME,
    Key: imageStoragePath,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 }); // valid for 1 hour
}
