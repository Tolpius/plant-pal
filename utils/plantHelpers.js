export function normalisePlantData(plant, isOwnedPlant = false) {
  if (!plant) {
    return {
      _id: "",
      name: "Unknown plant",
      botanicalName: "Unknown botanical name",
      imageUrl: "/defaultImage.png",
      location: "",
    };
  }

  return {
    _id: plant._id || "",
    name:
      (isOwnedPlant &&
        (plant.nickname?.trim() || plant.cataloguePlant?.name)) ||
      plant.name ||
      "Unknown plant",

    botanicalName:
      (isOwnedPlant && plant.cataloguePlant?.botanicalName) ||
      plant.botanicalName ||
      "Unknown botanical name",

    imageUrl:
      (isOwnedPlant &&
        (plant.userImageUrl || plant.cataloguePlant?.imageUrl)) ||
      plant.imageUrl ||
      "/defaultImage.png",

    location: plant.location || "",
  };
}
