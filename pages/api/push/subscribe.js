import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/db/dbConnect";
import Subscription from "@/lib/db/models/Subscription";

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).end();
  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.id) return response.status(401).end();

  const { endpoint, keys } = request.body;
  if (!endpoint || !keys?.p256dh || !keys?.auth)
    return response.status(400).json({ error: "invalid body" });

  await dbConnect();

  await Subscription.findOneAndUpdate(
    { endpoint },
    {
      p256dh: keys.p256dh,
      auth: keys.auth,
      userId: String(session.user.id),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  response.status(200).json({ ok: true });
}
