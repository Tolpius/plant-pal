import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getToken } from "next-auth/jwt";

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

    if (request.method === "GET") {
      const plants = await Plant.find();
      return response.status(200).json(plants);
    }
    
    if (request.method === "POST") {
      const newPlant = { ...request.body, isPublic: true };
      const plant = await Plant.create(newPlant);
      return response.status(201).json({ success: true, data: plant });
    } else {
      return response
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
