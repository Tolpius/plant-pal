self.addEventListener("install", () => console.log("SW installiert"));
self.addEventListener("activate", () => console.log("SW aktiv"));

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/reminders";

  event.waitUntil(clients.openWindow(url));
});
