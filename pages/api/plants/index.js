import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  try {
    await dbConnect();

    if (request.method === "GET") {
      const plants = await Plant.find();
      response.status(200).json(plants);
    }
    //every reqest method except "GET" is protected
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return response.status(401).json({ error: "Not authenticated" });
    }

    if (request.method === "POST") {
      const plant = await Plant.create(request.body);
      response.status(201).json({ success: true, data: plant });
    } else {
      response
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    response.status(500).json({ success: false, error: error.message });
  }
}
