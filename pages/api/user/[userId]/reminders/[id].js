import dbConnect from "@/lib/db/dbConnect";
import Reminder from "@/lib/db/models/Reminder";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  const { id } = request.query;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) return response.status(401).json({ error: "Not authenticated" });

  try {
    await dbConnect();

    if (request.method === "GET") {
      const reminder = await Reminder.findById(id);
      if (!reminder)
        return response.status(404).json({ error: "Reminder not found" });
      return response.status(200).json(reminder);
    }

    if (request.method === "PUT") {
      const data = request.body;
      const updated = await Reminder.findByIdAndUpdate(id, data, { new: true });
      if (!updated)
        return response.status(404).json({ error: "Reminder not found" });
      return response.status(200).json(updated);
    }

    if (request.method === "DELETE") {
      const deleted = await Reminder.findByIdAndDelete(id);
      if (!deleted) {
        return response.status(404).json({ error: "Reminder not found" });
      }
      return response.status(200).json({ message: "Reminder deleted" });
    }

    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
