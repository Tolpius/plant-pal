export function normalisePlantData(plant) {
  return {
    ...plant,
    name: plant.cataloguePlant?.name || plant.name,
    botanicalName: plant.cataloguePlant?.botanicalName || plant.botanicalName,
    imageUrl:
      plant.userImageUrl || plant.cataloguePlant?.imageUrl || plant.imageUrl,
    imagePath: plant.imageStoragePath || plant.cataloguePlant?.imageStoragePath,
    storedImageUrl:
      plant.storedImageUrl || plant.cataloguePlant?.storedImageUrl,
    description: plant.cataloguePlant?.description || plant.description,
    lightNeed: plant.cataloguePlant?.lightNeed || plant.lightNeed,
    waterNeed: plant.cataloguePlant?.waterNeed || plant.waterNeed,
    fertiliserSeasons:
      plant.cataloguePlant?.fertiliserSeasons || plant.fertiliserSeasons,
  };
}
