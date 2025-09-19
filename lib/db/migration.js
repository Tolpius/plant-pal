import dbConnect from "./dbConnect.js";
import OwnedPlant from "./models/OwnedPlant.js";

await dbConnect();
const ownedPlant = await OwnedPlant.updateMany(
  {},
  [
    {
      $set: {
        cataloguePlant: "$cataloguePlantId",
      },
    },
  ],
  {
    new: true,
  }
);
console.log(ownedPlant);
