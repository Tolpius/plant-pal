import dbConnect from "@/db/dbConnect";
import OwnedPlant from "@/db/models/OwnedPlant";
import { getToken } from "next-auth/jwt";
import Plant from "@/db/models/Plant";

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

  try {
    await dbConnect();
    switch (request.method) {
      case "GET":
        const plants = await OwnedPlant.find({ userId });
        if (!plants) {
          return response.status(404).json({ error: "ownedPlants not found" });
        }
        return response.status(200).json(plants);
      case "POST": {
        const plant = await Plant.create(request.body);
        const ownedPlant = new OwnedPlant({
          cataloguePlantId: plant._id,
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
      default:
        return response.status(405).json("Method not allowed");
    }
  } catch (error) {
    response.status(500).json({ success: false, error: error.message });
  }
}
