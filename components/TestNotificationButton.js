export default function TestNotificationButton() {
  async function handleClick() {
    if (!("Notification" in window)) {
      alert("Browser doesn't support notifications.");
      return;
    }

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      new Notification("Plant Pal – Reminder", {
        body: "Water your Plants 🌱",
        icon: "/icon.png",
      });
    } else {
      alert("Notifications are blocked.");
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        cursor: "pointer",
        background: "#4caf50",
        color: "#fff",
      }}
    >
      🔔 Test-Notification
    </button>
  );
}
