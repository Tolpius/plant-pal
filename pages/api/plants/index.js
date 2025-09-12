import dbConnect from "@/lib/db/dbConnect";
import Plant from "@/lib/db/models/Plant";
import { getSignedImageUrl } from "@/lib/s3/s3Client";
export default async function handler(request, response) {
  try {
    await dbConnect();
    switch (request.method) {
      case "GET": {
        const plants = await Plant.find().lean();
        const publicPlants = plants.filter((plant) => plant.isPublic === true);
        if (publicPlants && publicPlants.length > 0) {
          await Promise.all(
            publicPlants.map(async (plant) => {
              if (plant.imageStoragePath) {
                plant.storedImageUrl = await getSignedImageUrl(
                  plant.imageStoragePath
                );
              }
            })
          );
        }
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
