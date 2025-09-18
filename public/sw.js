self.addEventListener("install", () => console.log("SW installiert"));
self.addEventListener("activate", () => console.log("SW aktiv"));

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "Plant Pal";
  const options = {
    body: data.body || "",
    icon: data.icon || "/icon.png",
    data: { url: data.url },
    tag: data.tag,
    renotify: data.renotify ?? true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/reminders";

  event.waitUntil(clients.openWindow(url));
});
