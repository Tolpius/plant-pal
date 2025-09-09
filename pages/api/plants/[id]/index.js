import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  try {
    await dbConnect();
    const { id } = request.query;
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    switch (request.method) {
      case "GET": {
        const plant = await Plant.findById(id);
        if (!plant) {
          return response
            .status(404)
            .json({ success: false, message: "Plant not found" });
        }
        //Private plants are only accessible by admins!
        if (!plant.isPublic && token?.role !== "admin") {
          return response.status(403).json({ error: "Forbidden" });
        }
        return response.status(200).json(plant);
      }
      case "PUT": {
        if (!token) {
          return response.status(401).json({ error: "Not authenticated" });
        }
        if (token.role !== "admin") {
          return response.status(403).json({ error: "Forbidden" });
        }
        const editedPlant = { ...request.body, isPublic: true };
        const plant = await Plant.findByIdAndUpdate(id, editedPlant, {
          new: true,
          runValidators: true,
        });
        if (!plant) {
          return response
            .status(404)
            .json({ success: false, message: "Plant not found" });
        }
        return response.status(200).json({ success: true, data: plant });
      }
      case "DELETE": {
        if (!token) {
          return response.status(401).json({ error: "Not authenticated" });
        }
        if (token.role !== "admin") {
          return response.status(403).json({ error: "Forbidden" });
        }
        const deleted = await Plant.findByIdAndDelete(id);
        if (!deleted) {
          return response
            .status(404)
            .json({ success: false, message: "Plant not found" });
        }
        return response
          .status(200)
          .json({ success: true, message: "Plant deleted" });
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
