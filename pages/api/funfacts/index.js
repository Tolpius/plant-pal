import dbConnect from "@/db/dbConnect";
import Funfact from "@/db/models/Funfact";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const funfacts = await Funfact.find();
      return response.status(200).json(funfacts);
    } catch (error) {
      return response
        .status(500)
        .json({ success: false, error: error.message });
    }
  } else {
    return response
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
