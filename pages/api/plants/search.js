import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";

export default async function handler(request, response) {
  try {
    //every reqest method except "GET" is protected
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return response.status(401).json({ error: "Not authenticated" });
    }
    await dbConnect();

    if (request.method === "GET") {
      const query = request.query.query;
      const plants = await Plant.find({ name: query });
      return response.status(200).json(plants);
    } else {
      return response
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
