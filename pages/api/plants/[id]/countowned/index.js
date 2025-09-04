import dbConnect from "@/db/dbConnect";
import OwnedPlant from "@/db/models/OwnedPlant";
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

    if (request.method === "GET") {
      const count = await OwnedPlant.countDocuments({ userId, cataloguePlantId: id });
      return response.status(200).json(count);
    }
  } catch (error) {
    response.status(500).json({ success: false, error: error.message });
  }
}
