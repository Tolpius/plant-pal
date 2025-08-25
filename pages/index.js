import useSWR from "swr";

import PlantList from "@/components/PlantList";

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/plants");

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }
  return <PlantList plants={data} />;
}
