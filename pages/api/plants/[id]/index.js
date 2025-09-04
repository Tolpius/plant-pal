import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  try {
    await dbConnect();
    const { id } = request.query;

    if (request.method === "GET") {
      const plant = await Plant.findById(id);
      if (!plant) {
        return response
          .status(404)
          .json({ success: false, message: "Plant not found" });
      }
      return response.status(200).json(plant);
    }

    //every reqest method except "GET" is protected
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

    if (request.method === "PUT") {
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
    } else if (request.method === "DELETE") {
      const deleted = await Plant.findByIdAndDelete(id);
      if (!deleted) {
        return response
          .status(404)
          .json({ success: false, message: "Plant not found" });
      }
      return response
        .status(200)
        .json({ success: true, message: "Plant deleted" });
    } else {
      return response
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
