import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  try {
    await dbConnect();
    const { id } = request.query;
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    switch (request.method) {
      case "GET": {
        const plant = await Plant.findById(id);
        if (!plant) {
          return response
            .status(404)
            .json({ success: false, message: "Plant not found" });
        }
        //Private plants are only accessible by admins!
        if (!plant.isPublic && (!token || token?.role !== "admin")) {
          return response.status(403).json({ error: "Forbidden" });
        }
        return response.status(200).json(plant);
      }
      //From here on only admins can use the api methods
      default: {
        if (!token) {
          return response.status(401).json({ error: "Not authenticated" });
        }
        if (token.role !== "admin") {
          return response.status(403).json({ error: "Forbidden" });
        }

        switch (request.method) {
          //Use PUT for Edit Plant
          case "PUT": {
            const { addOwned, isPublic, ...editedPlant } = request.body;
            //Admins can choose, if the plant will be public
            if (isPublic === "true") {
              editedPlant.isPublic = true;
            } else {
              editedPlant.isPublic = false;
            }
            const plant = await Plant.findByIdAndUpdate(id, editedPlant, {
              new: true,
              runValidators: true,
            });
            if (!plant) {
              return response
                .status(404)
                .json({ success: false, message: "Plant not found" });
            }
            return response.status(200).json({ success: true, data: plant });
          }
          case "DELETE": {
            const deleted = await Plant.findByIdAndDelete(id);
            if (!deleted) {
              return response
                .status(404)
                .json({ success: false, message: "Plant not found" });
            }
            return response
              .status(200)
              .json({ success: true, message: "Plant deleted" });
          }
          //Use PATCH for toggle isPublic
          case "PATCH": {
            const updatedPlant = await Plant.findByIdAndUpdate(
              id,
              [
                { $set: { isPublic: { $not: "$isPublic" } } }
              ],
              { new: true, runValidators: true }
            );
            if (!updatedPlant) {
              return response
                .status(404)
                .json({ success: false, message: "Plant not found" });
            }
            return response
              .status(200)
              .json({ success: true, data: updatedPlant });
          }
          default:
            return response
              .status(405)
              .json({ success: false, message: "Method not allowed" });
        }
      }
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
