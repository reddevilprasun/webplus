"use server";
import { RegisterSchema } from "@/schema";
import * as z from "zod";
import bcrypt from "bcryptjs"
import User from "@/models/User";
import { getUserByNumber } from "@/data/user";
import { generateVerificationToken } from "@/data/token";
import { sentSMS } from "@/data/sms";
import { getVerificationTokenByNumber } from "@/data/vrification-token";
import VerificationToken from "@/models/VerificationToken";

export const register = async (value: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(value);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { number, firstName, lastName, password, code } = validatedFields.data;
  if (code) {
    const verificationToken = await getVerificationTokenByNumber(number);
    if (!verificationToken) {
      return { error: "Verification token does not exist!" };
    }
    if (verificationToken.token !== code) {
      return { error: "Verification code does not match!" };
    }
    const hasExpired = new Date(verificationToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Verification code has expired!" };
    }
    await VerificationToken.findOneAndDelete({ number: number });
    await User.findOneAndUpdate({number:number}, { numberVerified: new Date() })
    return {success: "Your number is verified!",successVerify: true};
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByNumber(number);
    if (existingUser) {
      return { error: "Number already in use!" }
    }
    const user = new User({ number, firstName, lastName, password: hashedPassword });
    //Generate the verification token
    const verificationToken = await generateVerificationToken(number);
    // Send the SMS using Twilio
    const smsResult = await sentSMS(number, `From WebPlus, Your One Time Password is ${verificationToken.token}. Please don't share this message.`);

    if (smsResult.error) {
       await VerificationToken.findOneAndDelete({number});
        return { error: smsResult.message }; // Handle SMS sending error
    }
    await user.save();
    return { success: "OTP sent!", Verification: true };
  }

}