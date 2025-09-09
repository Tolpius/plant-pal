import { useSession } from "next-auth/react";
import ReminderForm from "@/components/ReminderForm";

export default function NewReminderPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) return <p>Loading...</p>;

  return <ReminderForm userId={userId} />;
}
