import dbConnect from "@/db/dbConnect";
import Funfact from "@/db/models/Funfact";

export default async function handler(request, response) {
  await dbConnect();

  switch (request.method) {
    case "GET": {
      try {
        const funfacts = await Funfact.find();
        return response.status(200).json(funfacts);
      } catch (error) {
        return response
          .status(500)
          .json({ success: false, error: error.message });
      }
    }
    default:
      return response
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}
