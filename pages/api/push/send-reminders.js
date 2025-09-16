import dbConnect from "@/db/dbConnect";
import Reminder from "@/db/models/Reminder";
import Subscription from "@/db/models/Subscription";
import webpush from "web-push";
import { DateTime } from "luxon";
import OwnedPlant from "@/db/models/OwnedPlant";
import Plant from "@/db/models/Plant";

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).end();

  await dbConnect();

  try {
    const allReminders = await Reminder.find()
      .populate({
        path: "plantId",
        model: OwnedPlant,
        select: "nickname cataloguePlant",
        populate: {
          path: "cataloguePlant",
          model: Plant,
          select: "name",
        },
      })
      .lean();

    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
      console.error("VAPID keys missing");
      return response.status(500).json({});
    }

    webpush.setVapidDetails("mailto:joh.hammerl@web.de", publicKey, privateKey);

    let notificationsSentAmount = 0;

    const now = DateTime.now().setZone("Europe/Berlin");
    for (const reminder of allReminders) {
      const due = DateTime.fromJSDate(new Date(reminder.dueDate)).setZone(
        "Europe/Berlin"
      );

      let reminderDateTime;
      if (reminder.time) {
        const [hour, minute] = reminder.time.split(":").map(Number);
        reminderDateTime = due.set({ hour, minute });
      } else {
        reminderDateTime = due.set({ hour: 12, minute: 0 });
      }
      if (reminderDateTime >= now) continue;

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

          const dateTimeString = reminderDateTime.toFormat(
            "dd. LLL yyyy 'at' HH:mm"
          );

          function getPlantLabel() {
            const nickname = reminder.plantId?.nickname;
            if (nickname && nickname.trim().length > 0) return nickname;
            const name = reminder.plantId?.cataloguePlant?.name;
            if (name && name.trim().length > 0) return name;
            return "plant";
          }

          const plantLabel = getPlantLabel();

          const payload = {
            title: "Plant Pal - Reminder",
            body: `${reminder.title} your ${plantLabel}\n${dateTimeString} `,
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
