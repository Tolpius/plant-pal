import dbConnect from "@/db/dbConnect"; 
import Plant from "@/db/models/Plant";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const plants = await Plant.find({});
      response.status(200).json(plants);
    } catch (error) {
      response.status(500).json({ success: false, error: error.message });
    }
  } else if (request.method === "POST") {
    try {
      const plant = await Plant.create(request.body);
      response.status(201).json({ success: true, data: plant });
    } catch (error) {
      response.status(400).json({ success: false, error: error.message });
    }
  } else {
    response.status(405).json({ success: false, message: "Method not allowed" });
  }
}
