import dbConnect from "@/lib/mongoose";
import User from "@/models/User"


export const getUserByNumber = async (number:string) => {
  try {
    await dbConnect();
    const user = await User.findOne({number:number});
    return user;
    
  } catch (error:any) {
    console.log(error);
    return null;
  }
}

export const getUserById = async (_id:string) => {
  try {
    await dbConnect();
    console.log("ID: ", _id)
    const user = await User.findById(_id);
    return user;
    
  } catch (error:any) {
    console.log(error);
    return null;
  }
}