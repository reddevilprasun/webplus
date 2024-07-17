"use server";
import { sentSMS } from "@/data/sms";
import { generateVerificationToken } from "@/data/token";
import bcrypt from "bcryptjs"
import { getUserByNumber } from "@/data/user";
import { getVerificationTokenByNumber } from "@/data/vrification-token";
import VerificationToken from "@/models/VerificationToken";
import { ForgetPasswordSchema } from "@/schema";
import * as z from "zod"

export const forger = async (value: z.infer<typeof ForgetPasswordSchema>) => {
  const validatedFields = ForgetPasswordSchema.safeParse(value);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }
  const { code, number, password } = validatedFields.data;
  const existingUser = await getUserByNumber(number);
  if (!existingUser || !existingUser.number) {
    return { error: "User not found!" }
  };
  if (code && !password ) {
    const verificationToken = await getVerificationTokenByNumber(number);
    if (!verificationToken) {
      return { error: "Verification token not found!" }
    }
    if (verificationToken.token !== code) {
      return { error: "Invalid code!" }
    }
    await VerificationToken.findOneAndDelete({ number: number });
    return { success: "Your number is verified!", verificationSuccess: true };


  } else if (password) {
    if (!existingUser) {
      return { error: "User not found!" }
    }
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (isPasswordMatch) {
      return { error: "Please enter a new password different from the current password." }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();
    await sentSMS(number, "Your password is changed successfully! Please login to your account. If you not please Report!")
    return { success: "Your password is changed successfully!", passwordResetSuccess: true };

  } else {
    const existingVerificationToken = await getVerificationTokenByNumber(number);
    if (existingVerificationToken) {
      await VerificationToken.findOneAndDelete({ number: number });
    }
    const verificationToken = await generateVerificationToken(existingUser.number);
    // Send the SMS using Twilio
    const smsResult = await sentSMS(existingUser.number, `This is your reset password OTP : ${verificationToken.token}. Please don't share this msg!`);
    if (smsResult.error) {
      return { error: smsResult.message } //Handle SMS send error 
    }
    return { success: "OTP sent!", Verification: true };
  }


}