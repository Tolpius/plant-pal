import dbConnect from "@/db/dbConnect";

import { getToken } from "next-auth/jwt";
import User from "@/db/models/User";

export default async function handler(request, response) {
  const { userId } = request.query;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return response.status(401).json({ error: "Not authenticated" });
  }

  try {
    await dbConnect();
    switch (request.method) {
      case "PUT":
        const editedUser = { ...request.body, isPublic: true };
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

        return;

      default:
        return response.status(405).json("Method not allowed");
    }
  } catch (error) {
    response.status(500).json({ success: false, error: error.message });
  }
}
