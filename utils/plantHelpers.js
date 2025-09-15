export function getPlantName(plant) {
  if (!plant) return "Unknown plant";

  if (plant.nickname && plant.nickname.trim() !== "") {
    return plant.nickname;
  }

  if (
    plant.cataloguePlantId?.name &&
    plant.cataloguePlantId.name.trim() !== ""
  ) {
    return plant.cataloguePlantId.name;
  }

  return plant.name || "Unknown plant";
}

export function getPlantImage(plant) {
  return (
    plant?.userImageUrl ||
    plant?.imageUrl ||
    plant?.cataloguePlantId?.imageUrl ||
    "/defaultImage.png"
  );
}

export function getPlantBotanicalName(plant) {
  if (!plant) return "Unknown botanical name";

  if (
    plant.cataloguePlantId?.botanicalName &&
    plant.cataloguePlantId.botanicalName.trim() !== ""
  ) {
    return plant.cataloguePlantId.botanicalName;
  }

  return plant.botanicalName || "Unknown botanical name";
}
