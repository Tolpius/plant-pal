import dbConnect from "@/lib/db/dbConnect";
import User from "@/lib/db/models/User";
import Reminder from "@/lib/db/models/Reminder";
import OwnedPlant from "@/lib/db/models/OwnedPlant";
import { getToken } from "next-auth/jwt";

export default async function handler(request, response) {
  const { userId: queryUserId } = request.query;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) return response.status(401).json({ error: "Not authenticated" });
  if (token.role !== "admin" && token.id !== queryUserId) {
    return response.status(403).json({ error: "Access denied" });
  }

  try {
    await dbConnect();
    const user = await User.findById(queryUserId);
    if (!user) return response.status(404).json({ error: "User not found" });

    if (request.method === "GET") {
      const reminders = await Reminder.find({ userId: queryUserId })
        .populate({
          path: "plantId",
          populate: {
            path: "cataloguePlant",
          },
        })
        .sort({ dueDate: 1, createdAt: 1 });

      return response.status(200).json(reminders);
    }

    if (request.method === "POST") {
      const { plantId, title, description, dueDate, time } = request.body;

      if (!plantId || !title || !dueDate) {
        return response.status(400).json({ error: "Missing required fields" });
      }

      const due = time ? new Date(`${dueDate}T${time}`) : new Date(dueDate);

      const newReminder = await Reminder.create({
        userId: queryUserId,
        plantId,
        title,
        description,
        dueDate: due,
      });

      return response.status(201).json(newReminder);
    }

    return response.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Error in reminder handler:", err);
    return response.status(500).json({ error: err.message });
  }
}
