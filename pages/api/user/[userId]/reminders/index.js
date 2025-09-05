import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";
import Reminder from "@/db/models/Reminder";
import OwnedPlant from "@/db/models/OwnedPlant";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const { userId } = req.query;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  if (token.role !== "admin" && token.id !== userId) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.method === "GET") {
      const reminders = await Reminder.find({ userId })
        .populate({
          path: "plantId",
          model: OwnedPlant,
          select: "name botanicalName imageUrl",
        })
        .sort({ dueDate: 1, createdAt: 1 });

      return res.status(200).json(reminders);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
