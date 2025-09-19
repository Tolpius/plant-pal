import dbConnect from "@/lib/db/dbConnect";
import Plant from "@/lib/db/models/Plant";
import { getToken } from "next-auth/jwt";
import generateImageUrls from "@/lib/s3/generateImageUrls";
export default async function handler(request, response) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return response.status(401).json({ error: "Not authenticated" });
    }
    if (token.role !== "admin") {
      return response.status(403).json({ error: "Forbidden" });
    }
    await dbConnect();
    switch (request.method) {
      case "GET": {
        const plants = await Plant.find().lean();
        const plantsWithUrl = await generateImageUrls(plants);
        return response.status(200).json(plantsWithUrl);
      }
      default:
        return response
          .status(405)
          .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
