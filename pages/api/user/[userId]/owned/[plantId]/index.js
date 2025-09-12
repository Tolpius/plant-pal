import dbConnect from "@/lib/db/dbConnect";
import User from "@/lib/db/models/User";
import { getToken } from "next-auth/jwt";
import OwnedPlant from "@/lib/db/models/OwnedPlant";
import Plant from "@/lib/db/models/Plant";

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

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return response.status(404).json({ error: "User not found" });

    switch (request.method) {
      // GET: returns the owned plant of userId and plantId
      // HERE THE PLANT ID OF THE OWNED PLANT IS USED
      case "GET": {
        const ownedPlant = await OwnedPlant.findById(plantId);
        if (ownedPlant.imageStoragePath) {
          ownedPlant.storedImageUrl = await getSignedImageUrl(
            ownedPlant.imageStoragePath
          );
        }
        return response.status(200).json(ownedPlant);
      }
      // POST: Add Plant from Catalogue to OwnedList
      // HERE THE PLANT ID OF THE CATALOGUE IS USED
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
      // HERE THE OWNED-PLANT ID OF THE OWNED LIST IS USED
      case "PUT": {
        const updatedOwnedPlant = request.body;
        updatedOwnedPlant.cataloguePlantId = plantId;
        updatedOwnedPlant.userId = userId;
        const ownedPlant = await OwnedPlant.findByIdAndUpdate(
          plantId,
          updatedOwnedPlant,
          { new: true, runValidators: true }
        );
        return response.status(200).json(ownedPlant);
      }
      // HERE THE OWNED-PLANT ID OF THE OWNED LIST IS USED
      case "DELETE": {
        const ownedPlant = await OwnedPlant.findByIdAndDelete(plantId);
        return response.status(200).json(ownedPlant);
      }

      default:
        return response.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
