import { getSignedImageUrl } from "@/lib/s3/s3Client";
export default async function generateImageUrls(plants = []) {
  if (!plants.length) return plants;

  return Promise.all(
    plants.map(async (plant) => {
      if (plant.imageStoragePath) {
        return {
          ...plant,
          storedImageUrl: await getSignedImageUrl(plant.imageStoragePath),
        };
      }
      if (plant.cataloguePlant?.imageStoragePath) {
        return {
          ...plant,
          cataloguePlant: {
            ...plant.cataloguePlant,
            storedImageUrl: await getSignedImageUrl(
              plant.cataloguePlant.imageStoragePath
            ),
          },
        };
      }
      return plant;
    })
  );
}
