export function normalisePlantData(plant) {
  return {
    ...plant,
    name: plant.cataloguePlant?.name || plant.name,
    botanicalName: plant.cataloguePlant?.botanicalName || plant.botanicalName,
    imageUrl:
      plant.userImageUrl || plant.cataloguePlant?.imageUrl || plant.imageUrl,
      imagePath: asdasdasdasd;asdasdasd//TODO: ImagePath
  };
}
