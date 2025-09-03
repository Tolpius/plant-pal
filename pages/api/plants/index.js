import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  try {
    await dbConnect();
    switch (request.method) {
      case "GET": {
        const plants = await Plant.find();
        const publicPlants = plants.filter((plant) => plant.isPublic === true);
        return response.status(200).json(publicPlants);
      }
      default: {
        return response
          .status(405)
          .json({ success: false, message: "Method not allowed" });
      }
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
