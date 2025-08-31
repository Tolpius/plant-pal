import dbConnect from "@/db/dbConnect";
import Catalogue from "@/db/models/Catalogue";

export default async function handler(request, response) {
  try {
    await dbConnect();

    if (request.method === "GET") {
      const catalogues = await Catalogue.find();
      return response.status(200).json(catalogues);
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
