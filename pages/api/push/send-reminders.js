import dbConnect from "@/db/dbConnect";
import Reminder from "@/db/models/Reminder";
import Subscription from "@/db/models/Subscription";
import OwnedPlant from "@/db/models/OwnedPlant";
import Plant from "@/db/models/Plant";
import webpush from "web-push";
import { DateTime } from "luxon";
import { normalisePlantData } from "@/utils/plantHelpers";
import { getReminderDueDate } from "@/utils/reminderHelpers";

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).end();

  await dbConnect();

  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
      console.error("VAPID keys missing");
      return response.status(500).json({});
    }
    if (process.env.VERCEL_ENV !== "production")
      return response
        .status(403)
        .json({
          error: "forbidden",
          message: "This endpoint is only available in production environment",
        })
        .end();

    webpush.setVapidDetails("mailto:joh.hammerl@web.de", publicKey, privateKey);

    const now = DateTime.now().setZone("Europe/Berlin");
    let notificationsSentAmount = 0;

    // Finde alle subscriptions
    const allSubscriptions = await Subscription.find();

    // Ein Nutzer hat eventuell mehrere Subscriptions.
    // Findet alle einzigartigen userIds aus allen Subscriptions:
    const allSubscribedUsers = allSubscriptions.map(
      (subscription) => subscription.userId
    );

    const uniqueUserIds = allSubscribedUsers.filter(onlyUnique);

    // Findet alle Reminder inklusive Plant-Details von Nutzern mit mindestens einer Subscription:
    const allReminders = await Reminder.find({ userId: { $in: uniqueUserIds } })
      .populate({
        path: "plantId",
        model: OwnedPlant,
        populate: {
          path: "cataloguePlant",
          model: Plant,
        },
      })
      .lean();

    // Filtert nach allen Reminders mit dueDate+dueTime in der Vergangenheit:
    const dueReminders = allReminders.filter(
      (reminder) => getReminderDueDate(reminder) <= now
    );

    // Bearbeitet jeden fälligen Reminder:
    for (const reminder of dueReminders) {
      // Findet alle subscriptions des Users des Reminders um dorthin Notifications zu senden.
      const subscriptionsForUser = allSubscriptions.filter(
        (subscription) => reminder.userId === subscription.userId
      );

      // Bearbeitet jede Subscription des Users:
      for (const subscription of subscriptionsForUser) {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        };

        const dueDateTimeString = getReminderDueDate(reminder)
          .setZone("Europe/Berlin")
          .toFormat("dd. LLL yyyy 'at' HH:mm");

        const plant = normalisePlantData(reminder.plantId);

        const payload = {
          title: "Plant Pal - Reminder",
          body: `${reminder.title} your ${plant.name}\n${dueDateTimeString} `,
          icon: "/icon.png",
          url: "/reminders",
          tag: reminder._id.toString(),
        };

        // Fälligen Reminder an eine Subscription des Users webpush´n
        try {
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );

          notificationsSentAmount++;
        } catch (error) {
          // Falls laut Push-Service die Subscription nicht mehr besteht, wird die Subscription aus der Datenbank gelöscht.
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
