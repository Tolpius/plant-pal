import Image from "next/image";
import styled from "styled-components";
import OwnedButton from "./OwnedButton";
import OwnedCounter from "./counters/OwnedCounter";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "react-toastify";
import { normalisePlantData } from "@/utils/plantHelpers";

export default function Card({ plant: rawPlant, isOwnedPlantList, session }) {
  if (!rawPlant) return null;

  const plant = normalisePlantData(rawPlant, true);
  console.log("normalized plant:", plant);

  const userId = session?.user.id;
  const swrUrl = session ? `/api/user/${userId}/owned` : null;
  const { data: ownedPlants, mutate: mutatePlants } = useSWR(swrUrl);

  const {
    data: count,
    isLoading,
    mutate: mutateCount,
  } = useSWR(!isOwnedPlantList ? `/api/plants/${plant._id}/countowned` : null);

  async function handleAddOwned() {
    if (!session || !plant._id) return;

    const previousCount = count;
    mutateCount(previousCount + 1, false);
    mutatePlants([...(ownedPlants ?? []), plant], false);

    try {
      const fetchUrl = `/api/user/${userId}/owned/${plant._id}`;
      const fetchOptions = {
        method: "POST",
      };
      const response = await fetch(fetchUrl, fetchOptions);
      if (!response.ok) {
        mutateCount();
        mutatePlants();
        toast.error("Error: Failed to add Plant.");
      } else toast.success("Plant added.");
    } catch (error) {
      mutateCount();
      mutatePlants();
      toast.error("Error: Faild to add Plant.");
    }
  }

  if (isLoading) return null;

  return (
    <StyledLink
      href={
        isOwnedPlantList
          ? `/owned/${plant._id}`
          : {
              pathname: "/plants/[id]",
              query: { id: plant._id, from: "/catalogue" },
            }
      }
      aria-label={`View details for ${plant.name || "Unknown Plant"}`}
    >
      <CardWrapper>
        <ImageWrapper>
          <StyledImage
            src={plant.imageUrl}
            alt={plant.name || "Image of a plant"}
            width={300}
            height={0}
          />
        </ImageWrapper>
        <TextWrapper>
          {!isOwnedPlantList && (
            <>
              <OwnedButton
                onAddOwned={handleAddOwned}
                aria-label={`Add plant to owned for ${plant.name}`}
              />
              <OwnedCounter length={count || 0} />
            </>
          )}

          {isOwnedPlantList && plant.location && (
            <StyledLocation>{plant.location}</StyledLocation>
          )}
          <StyledName
            aria-label={`Common name: ${plant.name || "Unknown Plant"}`}
          >
            {plant.name || "Unknown Plant"}
          </StyledName>
          <StyledBotanicalName
            aria-label={`Botanical name: ${plant.botanicalName || ""}`}
          >
            {plant.botanicalName || ""}
          </StyledBotanicalName>
        </TextWrapper>
      </CardWrapper>
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  border: var(--border-sm-dark);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 300px;
  background-color: var(--color-secondary-dark);
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const TextWrapper = styled.div`
  padding: var(--padding-medium);
  font-family: var(--font-primary);
  color: var(--color-neutral-base);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 180px;
`;

const StyledLocation = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-medium);
  margin-bottom: 4px;
`;

const StyledName = styled.h3`
  font-size: var(--font-size-xl);
  padding: var(--padding-small);
`;

const StyledBotanicalName = styled.p`
  font-style: italic;
  color: var(--color-text-medium);
  font-size: var(--font-size-sm);
`;
