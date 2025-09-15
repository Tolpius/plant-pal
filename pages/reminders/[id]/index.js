import ReminderForm from "@/components/reminder/ReminderForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function EditReminderPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return <ReminderForm reminderId={id} userId={userId} />;
}
