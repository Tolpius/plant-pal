import ReminderForm from "@/components/reminder/ReminderForm";
import { useSession } from "next-auth/react";

export default function NewReminderPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) return <p>Loading...</p>;

  return <ReminderForm userId={userId} />;
}
