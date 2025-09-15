export function normalisePlantData(plant) {
  return {
    ...plant,
    name: plant.nickname || plant.cataloguePlant?.name || plant.name,

    botanicalName: plant.cataloguePlant?.botanicalName || plant.botanicalName,

    imageUrl:
      plant.userImageUrl || plant.cataloguePlant?.imageUrl || plant.imageUrl,
  };
}
