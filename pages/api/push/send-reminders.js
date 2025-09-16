import dbConnect from "@/db/dbConnect";
import Reminder from "@/db/models/Reminder";
import Subscription from "@/db/models/Subscription";
import webpush from "web-push";
import { DateTime } from "luxon";
import OwnedPlant from "@/db/models/OwnedPlant";
import Plant from "@/db/models/Plant";
import { normalisePlantData } from "@/utils/plantHelpers";

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).end();

  await dbConnect();

  try {
    const allReminders = await Reminder.find()
      .populate({
        path: "plantId",
        populate: {
          path: "cataloguePlant",
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

    const dueReminders = allReminders.filter((reminder) => {
      const due = DateTime.fromJSDate(new Date(reminder.dueDate)).setZone(
        "Europe/Berlin"
      );
      const [hour, minute] = reminder?.time?.split(":").map(Number) || [12, 0];
      const reminderDateTime = due.set({ hour, minute });
      return reminderDateTime <= now;
    });

    const remindedUserIds = dueReminders.map((reminder) => {
      return reminder.userId;
    });

    const uniqueUserIds = remindedUserIds.filter(onlyUnique);

    const allSubscriptions = await Subscription.find({
      userId: { $in: uniqueUserIds },
    });

    for (const reminder of dueReminders) {
      const subscriptionsForUser = allSubscriptions.filter(
        (subscription) => reminder.userId === subscription.userId
      );

      for (const subscription of subscriptionsForUser) {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        };
        const dateTimeString = DateTime.fromJSDate(new Date(reminder.dueDate))
          .setZone("Europe/Berlin")
          .toFormat("dd. LLL yyyy 'at' HH:mm");

        const plant = normalisePlantData(reminder.plantId);

        const payload = {
          title: "Plant Pal - Reminder",
          body: `${reminder.title} your ${plant.name}\n${dateTimeString} `,
          icon: "/icon.png",
          url: "/reminders",
          tag: reminder._id.toString(),
        };
        try {
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

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
