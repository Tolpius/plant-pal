export function normalisePlantData(plant) {
  return {
    ...plant,
    name: plant.cataloguePlant?.name || plant.name,
    botanicalName: plant.cataloguePlant?.botanicalName || plant.botanicalName,
    imageUrl:
      plant.userImageUrl || plant.cataloguePlant?.imageUrl || plant.imageUrl,
    description: plant.cataloguePlant?.description || plant.description,
    lightNeed: plant.cataloguePlant?.lightNeed || plant.lightNeed,
    waterNeed: plant.cataloguePlant?.waterNeed || plant.waterNeed,
    fertiliserSeasons:
      plant.cataloguePlant?.fertiliserSeasons || plant.fertiliserSeasons,
  };
}

export function getReminderDueDate(reminder) {
  const due = DateTime.fromJSDate(new Date(reminder.dueDate)).setZone(
    "Europe/Berlin"
  );
  const [hour, minute] = reminder?.time?.split(":").map(Number) || [12, 0];
  return due.set({ hour, minute });
}
