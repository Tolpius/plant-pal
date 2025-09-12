import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";
import { getToken } from "next-auth/jwt";
import OwnedPlant from "@/db/models/OwnedPlant";
import Plant from "@/db/models/Plant";

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
        const ownedPlant = await OwnedPlant.findOne({
          _id: plantId,
          userId,
        }).populate("cataloguePlantId", "name botanicalName imageUrl");
        if (!ownedPlant)
          return response.status(404).json({ error: "Owned plant not found" });
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
          cataloguePlantId: plant._id,
          userId,
          nickname: request.body.nickname || "",
          location: request.body.location || "",
          acquiredDate: request.body.acquiredDate || null,
          userImageUrl: request.body.userImageUrl || "",
          notes: request.body.notes || "",
        });
        await ownedPlant.save();
        await ownedPlant.populate("cataloguePlantId");
        return response.status(200).json(ownedPlant);
      }
      // HERE THE OWNED-PLANT ID OF THE OWNED LIST IS USED
      case "PUT": {
        const updatedOwnedPlant = await OwnedPlant.findOneAndUpdate(
          { _id: plantId, userId },
          request.body,
          { new: true }
        ).populate("cataloguePlantId", "name botanicalName imageUrl");
        return response.status(200).json(updatedOwnedPlant);
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
