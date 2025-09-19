import { getSignedImageUrl } from "@/lib/s3/s3Client";

export default async function generateImageUrls(items = []) {
  if (!items.length) return items;

  return Promise.all(
    items.map(async (item) => {
      // Case 1: CataloguePlant
      if (item.imageStoragePath) {
        return {
          ...item,
          storedImageUrl: await getSignedImageUrl(item.imageStoragePath),
        };
      }

      // Case 2: ownedPlant with cataloguePlant
      if (item.cataloguePlant?.imageStoragePath) {
        return {
          ...item,
          cataloguePlant: {
            ...item.cataloguePlant,
            storedImageUrl: await getSignedImageUrl(
              item.cataloguePlant.imageStoragePath
            ),
          },
        };
      }

      // case 3: reminder with ownedPlant with cataloguePlant
      if (item.plantId) {
        const ownedPlantWithUrls = await generateImageUrls([item.plantId]);
        return {
          ...item,
          plantId: ownedPlantWithUrls[0],
        };
      }

      return item;
    })
  );
}
