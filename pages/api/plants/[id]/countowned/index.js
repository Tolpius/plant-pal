import dbConnect from "@/lib/db/dbConnect";
import OwnedPlant from "@/lib/db/models/OwnedPlant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  const { id } = request.query;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return response.status(401).json({ error: "Not authenticated" });
  }
  const userId = token.id;

  try {
    await dbConnect();
    switch (request.method) {
      case "GET": {
        const count = await OwnedPlant.countDocuments({
          userId,
          cataloguePlant: id,
        });
        return response.status(200).json(count);
      }
      default:
        return response
          .status(405)
          .json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    response.status(500).json({ success: false, error: error.message });
  }
}
