import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";
import AdminPlantList from "@/components/admin/AdminPlantList";
import PlantFilter from "@/components/admin/filter/PlantFilter";
import MessageNoPlants from "@/components/MessageNoPlants";
import { toast } from "react-toastify";

export default function AdminCatalogue() {
  const { data, isLoading, mutate } = useSWR("/api/admin/catalogue");
  const [filter, setFilter] = useState({ isPublic: "all" });
  const { data: session, status: sessionStatus } = useSession();
  async function onDelete(plantId) {
    mutate(
      data.filter((plant) => plant._id !== plantId),
      false
    );
    try {
      const response = await fetch(`/api/plants/${plantId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Plant removed.");
      } else {
        toast.error("Failed to remove Plant.");
      }
    } catch (error) {
      toast.error("Failed to remove Plant.");
      console.error(error);
    } finally {
      mutate();
    }
  }

  async function onTogglePublic(plantId) {
    mutate(
      data.map((plant) => {
        if (plant._id === plantId) {
          return { ...plant, isPublic: !plant.isPublic };
        }
        return plant;
      }),
      false
    );
    try {
      const response = await fetch(`/api/plants/${plantId}`, {
        method: "PATCH",
      });
      if (response.ok) {
        toast.success(`Plant successfully toggled`);
      } else {
        toast.error("Failed to toggle Plant.");
      }
    } catch (error) {
      toast.error("Failed to toggle Plant.");
      console.error(error);
    } finally {
      mutate();
    }
  }

  if (isLoading || sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }

  if (data.length === 0) {
    return <MessageNoPlants />;
  }
  const filteredPlantList =
    filter.isPublic === "all"
      ? data
      : data.filter((plant) => plant.isPublic === filter.isPublic);

  return (
    <>
      <StyledHeadline>Browse to find and select your plants. </StyledHeadline>
      <PlantFilter onFilter={setFilter} />
      <AddLink href={"/add"}>Add a new plant</AddLink>
      <AdminPlantList
        plants={filteredPlantList}
        session={session}
        onDelete={onDelete}
        onTogglePublic={onTogglePublic}
      />
    </>
  );
}

const StyledHeadline = styled.h2`
  padding-top: 10px;
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--color-text-base);
`;

const AddLink = styled(Link)`
  border: 1px solid #000000;
  border-radius: 10px;
  background-color: var(--color-primary-light);
  text-decoration: none;
  text-align: center;
  padding: var(--padding-small);
  color: var(--color-black);
`;
