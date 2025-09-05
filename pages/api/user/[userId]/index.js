import dbConnect from "@/db/dbConnect";

import { getToken } from "next-auth/jwt";
import User from "@/db/models/User";

export default async function handler(request, response) {
  const { userId } = request.query;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return response.status(401).json({ error: "Not authenticated" });
  }

  try {
    await dbConnect();
    if (request.method === "PUT") {
   
       const userOldDarkMode = await User.findById(userId)

      const editedUser = { ...userOldDarkMode, isDarkMode: request.body  };
      const updatedUser = await User.findByIdAndUpdate(id, editedUser, {
        new: true,
        runValidators: true,
      }); 
      console.log('editedUser: ', editedUser);
      
      if (!updatedUser) {
        return response
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return response.status(200).json({ success: true, data: updatedUser });
    } else {
      return response.status(405).json("Method not allowed");
    }
  } catch (error) {
    response.status(500).json({ success: false, error: error.message });
  }
}
