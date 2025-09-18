import dbConnect from "@/lib/db/dbConnect";
import OwnedPlant from "@/lib/db/models/OwnedPlant";
import { getToken } from "next-auth/jwt";
import Plant from "@/lib/db/models/Plant";
import { moveFile } from "@/lib/s3/s3Client";
import generateImageUrls from "@/lib/s3/generateImageUrls";
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
      // GET: Get all ownedPlants belonging to the userId
      case "GET":
        const plants = await OwnedPlant.find({ userId })
          .populate("cataloguePlant")
          .lean();
        if (!plants) {
          return response.status(404).json({ error: "ownedPlants not found" });
        }
        const plantsWithUrl = await generateImageUrls(plants);
        return response.status(200).json(plantsWithUrl);
      // POST: Add a completely new plant to catalogue
      case "POST": {
        const { addOwned, isPublic, tempImageStoragePath, ...newPlant } =
          request.body;
        //Admins can choose, if the plant will be public
        if (token.role === "admin" && isPublic === "true") {
          newPlant.isPublic = true;
        }

        if (tempImageStoragePath) {
          const fileName = tempImageStoragePath.replace(/^temp\//, "");
          newPlant.imageStoragePath = `plants/${fileName}`;
          await moveFile(tempImageStoragePath, newPlant.imageStoragePath);
        }

        const plant = await Plant.create(newPlant);
        //Admins can choose, wether the plant will be added to their own plants
        if (
          token.role === "user" ||
          (token.role === "admin" && addOwned === "true")
        ) {
          const ownedPlant = new OwnedPlant({
            cataloguePlant: plant._id,
            userId: token.id,
          });
          await ownedPlant.save();
          return response.status(200).json(ownedPlant);
        }
        return response.status(200).json(plant);
      }
      default:
        return response.status(405).json("Method not allowed");
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: error.message });
  }
}
