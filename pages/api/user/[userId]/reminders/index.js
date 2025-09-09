import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";
import Reminder from "@/db/models/Reminder";
import OwnedPlant from "@/db/models/OwnedPlant";
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
          model: OwnedPlant,
          select: "name botanicalName imageUrl",
        })
        .sort({ dueDate: 1, createdAt: 1 });

      return response.status(200).json(reminders);
    }

    if (request.method === "POST") {
      const {
        plantId,
        title,
        description,
        dueDate,
        time,
        isRecurring,
        recurringInterval,
        recurringUnit,
      } = request.body;

      const newReminder = await Reminder.create({
        userId: queryUserId,
        plantId,
        title,
        description,
        dueDate,
        time,
        isRecurring,
        recurringInterval,
        recurringUnit,
      });
      return response.status(201).json(newReminder);
    }

    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
