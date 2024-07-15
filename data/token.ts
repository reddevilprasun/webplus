import dbConnect from "@/lib/mongoose";
import { getVerificationTokenByNumber } from "./vrification-token";
import VerificationToken from "@/models/VerificationToken";
import { generateOTP } from "./otp";

export const generateVerificationToken = async (number:string) => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + 3600000);
  await dbConnect();
  const existingToken = await getVerificationTokenByNumber(number);
  if (existingToken) {
    await VerificationToken.findOneAndDelete({
      number: existingToken.number,
    })
  }

  const newVerificationToken = await new VerificationToken({
    number: number,
    token:otp,
    expires: expires,
  })
  await newVerificationToken.save();
  return newVerificationToken;
}