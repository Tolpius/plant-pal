import dbConnect from "@/db/dbConnect";
import Funfact from "@/db/models/Funfact";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const funfacts = await Funfact.find();
      response.status(200).json(funfacts);
    } catch (error) {
      response.status(500).json({ success: false, error: error.message });
    }
  } else {
    response
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
