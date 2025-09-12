self.addEventListener("install", () => console.log("SW installiert"));
self.addEventListener("activate", () => console.log("SW aktiv"));

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "Plant Pal";
  const options = {
    body: data.body || "",
    icon: data.icon || "/icon.png",
    // tag: crypto.randomUUID(),<---debugging
    tag: data.tag,
    data,
    renotify: data.renotify ?? true,
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/reminders";

  event.waitUntil(clients.openWindow(url));
});
