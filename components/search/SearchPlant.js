import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SearchPlant({ onSearchResult }) {
  const { data: session, status: sessionStatus } = useSession();

  if (sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  async function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { query } = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/plants/search?query=${query}`);
    const searchResult = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to search plant: ${response.statusText}`);
    }
    onSearchResult(searchResult);
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <input
          name="query"
          type="text"
          placeholder="search for name/botanicalName"
        ></input>
        <button type="submit">Search Plant</button>
      </form>
    </>
  );
}
