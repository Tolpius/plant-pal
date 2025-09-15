import dbConnect from "@/lib/db/dbConnect";
import User from "@/lib/db/models/User";
import { getToken } from "next-auth/jwt";
import OwnedPlant from "@/lib/db/models/OwnedPlant";
import Plant from "@/lib/db/models/Plant";
import { deleteFile, getSignedImageUrl } from "@/lib/s3/s3Client";
import Reminder from "@/lib/db/models/Reminder";

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
        const ownedPlant = await OwnedPlant.findById(plantId).populate("cataloguePlant").lean();
                if (!ownedPlant)
          return response.status(404).json({ error: "Owned plant not found" });
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
          cataloguePlant: plant._id,
          userId,
          nickname: request.body.nickname,
          location: request.body.location,
          acquiredDate: request.body.acquiredDate || null,
          userImageUrl: request.body.userImageUrl,
          notes: request.body.notes,
                    imageStoragePath: plant.imageStoragePath,
        });
        await ownedPlant.save();
        await ownedPlant.populate("cataloguePlant");
        return response.status(200).json(ownedPlant);
      }
      // HERE THE OWNED-PLANT ID OF THE OWNED LIST IS USED
      case "PUT": {
        const updatedOwnedPlant = await OwnedPlant.findByIdAndUpdate(
          plantId,
          request.body,
          { new: true }
        ).populate("cataloguePlant");
        return response.status(200).json(updatedOwnedPlant);
      }
      // HERE THE OWNED-PLANT ID OF THE OWNED LIST IS USED
      case "DELETE": {
        const ownedPlant = await OwnedPlant.findByIdAndDelete(plantId);
        if (!ownedPlant) {
          return response.status(404).json({ error: "Owned plant not found" });
        }
        await Reminder.deleteMany({
          userId,
          plantId: ownedPlant._id,
        });
        if (ownedPlant.imageStoragePath) {
          await deleteFile(ownedPlant.imageStoragePath);
        }



        return response
          .status(200)
          .json({ success: true, deletedPlant: ownedPlant });
      }
      default:
        return response.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
