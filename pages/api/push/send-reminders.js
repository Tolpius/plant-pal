import dbConnect from "@/db/dbConnect";
import Reminder from "@/db/models/Reminder";
import Subscription from "@/db/models/Subscription";
import webpush from "web-push";
import OwnedPlant from "@/db/models/OwnedPlant";

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).end();

  await dbConnect();

  try {
    const allReminders = await Reminder.find()
      .populate({ model: OwnedPlant, path: "plantId", select: "name _id" })
      .lean();

    const now = new Date();
    const filteredReminders = allReminders.filter(
      (reminder) => reminder.dueDate < now
    );

    if (filteredReminders.length === 0) {
      return response.status(200).json({ sent: 0 });
    }
    console.log(
      `Found ${filteredReminders.length} triggered reminders to push notifications`
    );

    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
      console.error("VAPID keys missing");
      return response.status(500).json({});
    }

    webpush.setVapidDetails("mailto:joh.hammerl@web.de", publicKey, privateKey);

    let notificationsSentAmount = 0;
    for (const reminder of filteredReminders) {
      const subs = await Subscription.find({ userId: String(reminder.userId) });

      for (const subscription of subs) {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          };
          const payload = {
            title: "Plant Pal - Reminder",
            body: `${reminder.title} your ${reminder.plantId?.name || "plant"}`,
            icon: "/icon.png",
            url: "/reminders",
            tag: reminder._id.toString(),
          };
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );
          notificationsSentAmount++;
        } catch (error) {
          if (error.statusCode === 410) {
            await Subscription.deleteOne({ _id: subscription._id });
          } else {
            console.error(error);
          }
        }
      }
    }

    return response.status(200).json({ sent: notificationsSentAmount });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message }).end();
  }
}
