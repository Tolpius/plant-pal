import dbConnect from "@/lib/db/dbConnect";
import Plant from "@/lib/db/models/Plant";
import { deleteFile, getSignedImageUrl, moveFile } from "@/lib/s3/s3Client";
import OwnedPlant from "@/lib/db/models/OwnedPlant";
import Reminder from "@/lib/db/models/Reminder";
import { getToken } from "next-auth/jwt";
export default async function handler(request, response) {
  try {
    await dbConnect();
    const { id } = request.query;
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    switch (request.method) {
      case "GET": {
        const plant = await Plant.findById(id).lean();
        if (!plant) {
          return response
            .status(404)
            .json({ success: false, message: "Plant not found" });
        }
        if (plant.imageStoragePath) {
          plant.storedImageUrl = await getSignedImageUrl(
            plant.imageStoragePath
          );
        }
        //Private plants are only accessible by admins!
        if (!plant.isPublic && (!token || token?.role !== "admin")) {
          return response.status(403).json({ error: "Forbidden" });
        }
        return response.status(200).json(plant);
      }
      //From here on only admins can use the api methods
      default: {
        if (!token) {
          return response.status(401).json({ error: "Not authenticated" });
        }
        if (token.role !== "admin") {
          return response.status(403).json({ error: "Forbidden" });
        }

        switch (request.method) {
          //Use PUT for Edit Plant

          case "PUT": {
            const { addOwned, isPublic, tempImageStoragePath, ...editedPlant } =
              request.body;
            //Admins can choose, if the plant will be public
            if (isPublic === "true") {
              editedPlant.isPublic = true;
            } else {
              editedPlant.isPublic = false;
            }

            if (tempImageStoragePath) {
              const fileName = tempImageStoragePath.replace(/^temp\//, "");
              editedPlant.imageStoragePath = `plants/${fileName}`;
              await moveFile(
                tempImageStoragePath,
                editedPlant.imageStoragePath
              );
            }

            const plant = await Plant.findByIdAndUpdate(id, editedPlant, {
              new: false,
              runValidators: true,
            });

            if (!plant) {
              return response
                .status(404)
                .json({ success: false, message: "Plant not found" });
            }

            //If the image gets updated (either new s3 file or new URL) then delete the old s3 file
            if (
              (editedPlant.imageStoragePath && plant.imageStoragePath) ||
              (editedPlant.imageUrl && plant.imageStoragePath)
            ) {
              deleteFile(plant.imageStoragePath);
            }
            return response.status(200).json({ success: true, data: plant });
          }
          case "DELETE": {
            try {
              //Delete CataloguePlant
              const deletedPlant = await Plant.findByIdAndDelete(id);

              if (!deletedPlant) {
                return response
                  .status(404)
                  .json({ success: false, message: "Plant not found" });
              }
              if (deletedPlant.imageStoragePath) {
                await deleteFile(deletedPlant.imageStoragePath);
              }

              const ownedPlants = await OwnedPlant.find({ cataloguePlant: id });
              if (ownedPlants.length > 0) {
                const ownedPlantIds = [];
                const deletePromises = [];

                ownedPlants.map((ownedPlant) => {
                  ownedPlantIds.push(ownedPlant._id);
                  if (ownedPlant.imageStoragePath) {
                    deletePromises.push(deleteFile(ownedPlant.imageStoragePath));
                  }
                });

                await Promise.all(deletePromises);
                await Reminder.deleteMany({ plantId: { $in: ownedPlantIds } });
                await OwnedPlant.deleteMany({ cataloguePlant: id });
              }
              return response.status(200).json({
                success: true,
                message:
                  "Plant and all related owned plants + reminders deleted",
                deletedPlant,
              });
            } catch (error) {
              console.error("Error deleting plant cascade:", error);
              return response.status(500).json({
                success: false,
                message: "Error while deleting plant and related data",
                error: error.message,
              });
            }
          }

          //Use PATCH for toggle isPublic
          case "PATCH": {
            const updatedPlant = await Plant.findByIdAndUpdate(
              id,
              [{ $set: { isPublic: { $not: "$isPublic" } } }],
              { new: true, runValidators: true }
            );
            if (!updatedPlant) {
              return response
                .status(404)
                .json({ success: false, message: "Plant not found" });
            }
            return response
              .status(200)
              .json({ success: true, data: updatedPlant });
          }
          default:
            return response
              .status(405)
              .json({ success: false, message: "Method not allowed" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, error: error.message });
  }
}
