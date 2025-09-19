import dbConnect from "@/lib/db/dbConnect";
import Plant from "@/lib/db/models/Plant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import generateImageUrls from "@/lib/s3/generateImageUrls";
export default async function handler(request, response) {
  try {
    const session = await getServerSession(request, response, authOptions);
    if (!session) {
      return response.status(401).json({ error: "Not authenticated" });
    }
    await dbConnect();

    switch (request.method) {
      case "GET": {
        const query = request.query.query;
        if (!query)
          return response
            .status(422)
            .json({ success: false, message: "Specify the 'query' parameter" });

        const keywords = query.trim().split(" ");
        const pattern = keywords.join("|");
        const plants = await Plant.find({
          $or: [
            {
              name: { $regex: pattern, $options: "i" },
            },
            { botanicalName: { $regex: pattern, $options: "i" } },
          ],
        }).lean();
        const publicPlants = plants.filter((plant) => plant.isPublic === true);
        const publicPlantsWithUrls = await generateImageUrls(publicPlants);
        return response.status(200).json(publicPlantsWithUrls ?? []);
      }
      default:
        return response
          .status(405)
          .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
//TODO: Nur Public Plants!!
