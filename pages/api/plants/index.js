import dbConnect from "@/lib/db/dbConnect";
import Plant from "@/lib/db/models/Plant";
import generateImageUrls from "@/lib/s3/generateImageUrls";
export default async function handler(request, response) {
  try {
    await dbConnect();
    switch (request.method) {
      case "GET": {
        const plants = await Plant.find().lean();
        const publicPlants = plants.filter((plant) => plant.isPublic === true);
        const publicPlantsWithUrls = await generateImageUrls(publicPlants);
        return response.status(200).json(publicPlantsWithUrls);
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
