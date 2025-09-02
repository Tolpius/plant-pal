import BackButton from "@/components/BackButton";
import PlantList from "@/components/PlantList";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function SearchPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { data, isLoading } = useSWR("/api/plants");

  if (isLoading || sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }

  function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data);
  }

  return (
    <>
      <BackButton />
      <h3>add a new plant</h3>
      <input type="checkbox"></input>
      <label>hide owned</label>
      <form onSubmit={handleSearch}>
        <input
          name="query"
          type="text"
          placeholder="search for name/botanicalName"
        ></input>
        <button type="submit">Search Plant</button>
      </form>
      <PlantList plants={data} session={session} />
      <button>Add a new one</button>
    </>
  );
}
