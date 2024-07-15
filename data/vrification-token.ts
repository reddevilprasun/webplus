import dbConnect from "@/lib/mongoose";
import VerificationToken from "@/models/VerificationToken";

export const getVerificationTokenByToken = async(token:string) => {
  try {
    await dbConnect();
    const verificationToken = await VerificationToken.findOne({token});
    return verificationToken;
  } catch (error:any) {
    return null;
  }
} 

export const getVerificationTokenByNumber = async(number:string) => {
  try {
    await dbConnect();
    const verificationToken = await VerificationToken.findOne({number});
    return verificationToken;
  } catch (error:any) {
    return null;
  }
} 