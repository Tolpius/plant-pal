export function normalisePlantData(plant) {
  return {
    ...plant,
    name: plant.cataloguePlant?.name || plant.name || "plant not found",
    botanicalName: plant.cataloguePlant?.botanicalName || plant.botanicalName || "plant not found",
    imageUrl:
      plant.userImageUrl || plant.cataloguePlant?.imageUrl || plant.imageUrl,
    imagePath: plant.imageStoragePath || plant.cataloguePlant?.imageStoragePath,
    storedImageUrl:
      plant.storedImageUrl || plant.cataloguePlant?.storedImageUrl,
    description: plant.cataloguePlant?.description || plant.description || "plant not found",
    lightNeed: plant.cataloguePlant?.lightNeed || plant.lightNeed || "plant not found",
    waterNeed: plant.cataloguePlant?.waterNeed || plant.waterNeed || "plant not found",
    fertiliserSeasons:
      plant.cataloguePlant?.fertiliserSeasons || plant.fertiliserSeasons || ["plant not found"],
  };
}
