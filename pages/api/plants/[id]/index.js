import dbConnect from "@/db/dbConnect"; 
import Plant from "@/db/models/Plant";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    try {
      const plant = await Plant.findById(id);
      if (!plant) {
        return response
          .status(404)
          .json({ success: false, message: "Plant not found" });
      }
      response.status(200).json(plant);
    } catch (error) {
      response.status(500).json({ success: false, error: error.message });
    }
  } else if (request.method === "PUT") {
    try {
      const plant = await Plant.findByIdAndUpdate(id, request.body, {
        new: true,
        runValidators: true,
      });
      if (!plant) { 
        return response
          .status(404)
          .json({ success: false, message: "Plant not found" });
      }
      response.status(200).json({ success: true, data: plant });
    } catch (error) {
      response.status(500).json({ success: false, error: error.message });
    }
  } else if (request.method === "DELETE") {
    try {
      const deleted = await Plant.findByIdAndDelete(id);
      if (!deleted) {
        return response
          .status(404)
          .json({ success: false, message: "Plant not found" });
      }
      response.status(200).json({ success: true, message: "Plant deleted" });
    } catch (error) {
      response.status(500).json({ success: false, error: error.message });
    }
  } else {
    response.status(405).json({ success: false, message: "Method not allowed" });
  }
}
