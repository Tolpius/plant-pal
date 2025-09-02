import dbConnect from "@/db/dbConnect";
import OwnedPlant from "@/db/models/OwnedPlant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  const { userId } = request.query;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return response.status(401).json({ error: "Not authenticated" });
  }
  if (token.role !== "admin" && token.id !== userId) {
    return response.status(403).json({ error: "Access denied" });
  }

  await dbConnect();
  try {

  if (request.method === "GET") {
      const plants = await OwnedPlant.find({userId});
      if (!plants) {
        return response.status(404).json({ error: "ownedPlants not found" });
      }
     return response.status(200).json(plants);
    } 
    }
    catch (error) {
      response.status(500).json({ success: false, error: error.message });
  }
}

