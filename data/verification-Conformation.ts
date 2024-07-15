import dbConnect from "@/lib/mongoose";
import VerificationConfirmation from "@/models/VerificationConformation";

export const getVerificationConfirmationByUserID = async(_id:string) => {
  try {
    await dbConnect();
    const result = await VerificationConfirmation.findOne({userId:_id});
    return result;
  } catch (error:any) {
    return null;
  }
}