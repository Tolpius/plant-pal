import { useSession, signIn, signOut } from "next-auth/react";

export default function SessionButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn({ callbackUrl: "/owned" })}>Sign in</button>
    </>
  );
}
