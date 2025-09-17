import dbConnect from "@/db/dbConnect";
import Reminder from "@/db/models/Reminder";
import Subscription from "@/db/models/Subscription";
import webpush from "web-push";
import { DateTime } from "luxon";
import { normalisePlantData, getReminderDueDate } from "@/utils/plantHelpers";

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
    webpush.setVapidDetails("mailto:joh.hammerl@web.de", publicKey, privateKey);

    const now = DateTime.now().setZone("Europe/Berlin");
    let notificationsSentAmount = 0;

    //Finde alle subscriptions:

    const allSubscriptions = await Subscription.find();

    // uniqueUserId Collection aus subscriptions:

    const allSubscribedUsers = allSubscriptions.map(
      (subscription) => subscription.userId
    );

    const uniqueUserIds = allSubscribedUsers.filter(onlyUnique);

    // 3. alle reminder die ne userId in der uniqueUserId collection haben

    const allReminders = await Reminder.find({ userId: { $in: uniqueUserIds } })
      .populate({
        path: "plantId",
        populate: {
          path: "cataloguePlant",
        },
      })
      .lean();

    // 4. reminder mit dueDate filtern

    const dueReminders = allReminders.filter(
      (reminder) => getReminderDueDate(reminder) <= now
    );

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

        // 5. reminder zu allen subs des users webpush´n
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
