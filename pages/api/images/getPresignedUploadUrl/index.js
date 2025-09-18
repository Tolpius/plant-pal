import { getToken } from "next-auth/jwt";
import { getSignedUploadUrl } from "@/lib/s3/s3Client";
export default async function handler(request, response) {
  if (request.method !== "POST")
    return response.status(405).json({ error: "Method not allowed" });

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return response.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { fileName, mimeType, folder } = request.body;

    if (!fileName || !mimeType) {
      return response
        .status(400)
        .json({ error: "fileName and mimeType are required" });
    }

    const uploadData = await getSignedUploadUrl({
      fileName,
      mimeType,
      folder,
    });

    response.status(200).json(uploadData);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    response.status(500).json({ error: "Failed to generate presigned URL" });
  }
}
