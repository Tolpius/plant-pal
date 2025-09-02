import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";
import { getToken } from "next-auth/jwt";
import OwnedPlant from "@/db/models/OwnedPlant";
import Plant from "@/db/models/Plant";
import mongoose from "mongoose";

export default async function handler(request, response) {
  const { userId, plantId } = request.query;
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
    const user = await User.findById(userId);
    if (!user) return response.status(404).json({ error: "User not found" });

    switch (request.method) {
      // GET: returns boolean if current plant is included in owned plants
      case "GET":
        return response.status(200).json(user.owned.includes(plantId));

      // POST: Add Plant to OwnedList
      case "POST": {
        const plant = await Plant.findById(plantId);
        if (!plant) {
          return response.status(404).json({ error: "Plant not found" });
        }
        const ownedPlant = new OwnedPlant({
          cataloguePlantId: plantId,
          userId: userId,
          name: plant.name,
          botanicalName: plant.botanicalName,
          imageUrl: plant.imageUrl,
          waterNeed: plant.waterNeed,
          lightNeed: plant.lightNeed,
          fertiliserSeasons: plant.fertiliserSeasons,
          description: plant.description,
        });
        await ownedPlant.save();
        return response.status(200).json(ownedPlant);
      }

      // DELETE: Remove Plant from OwnedList
      case "DELETE": {
        user.owned = user.owned.filter((id) => id !== plantId);
        await user.save();

        return response.status(200).json(user.owned);
      }

      default:
        return response.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
