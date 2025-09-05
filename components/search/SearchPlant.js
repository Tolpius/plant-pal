import { useSession } from "next-auth/react";

export default function SearchPlant({ onSearch }) {
  const { data: session, status: sessionStatus } = useSession();

  if (sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { query } = Object.fromEntries(formData);
    if (query.trim() === "") {
      onSearch("");
      return;
    }

    onSearch(query);
  }

  return (
    <form
      onSubmit={handleSearch}
      onChange={(event) => event.currentTarget.requestSubmit()}
    >
      <input
        name="query"
        type="text"
        placeholder="search for name/botanicalName"
      ></input>
      <button type="submit">Search Plant</button>
    </form>
  );
}
