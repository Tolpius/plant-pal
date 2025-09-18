import urlBase64ToUint8Array from "@/utils/urlBase64";

export async function ensurePushSubscription() {
  if (!("serviceWorker" in navigator) || !("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const publicKeyArray = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKeyArray,
    });
  }

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
}
