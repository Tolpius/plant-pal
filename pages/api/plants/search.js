import dbConnect from "@/db/dbConnect";
import Plant from "@/db/models/Plant";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  try {
    //every reqest method except "GET" is protected
    const session = await getServerSession(request, response, authOptions);
    if (!session) {
      return response.status(401).json({ error: "Not authenticated" });
    }
    await dbConnect();

    if (request.method === "GET") {
      const query = request.query.query;
      if (!query)
        response
          .status(422)
          .json({ success: false, message: "Specify the 'query' parameter" });
      //const pattern = query.replace(" ", "|");

      const keywords = query
        .trim() //entf. Leers am start u end
        .split(/\s+/); //bricht string in einzelne Wörter

      const pattern = keywords.join("|"); // Monstera|Pothos
      const plants = await Plant.find({
        $or: [
          {
            name: { $regex: pattern, $options: "i" },
          },
          { botanicalName: { $regex: pattern, $options: "i" } },
        ],
      });
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
