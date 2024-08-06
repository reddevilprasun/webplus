"use server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schema";
import * as z from "zod";
import { AuthError } from "next-auth"
import { getUserByNumber } from "@/data/user";
import { generateVerificationToken } from "@/data/token";
import { sentSMS } from "@/data/sms";
import { getVerificationTokenByNumber } from "@/data/vrification-token";
import VerificationToken from "@/models/VerificationToken";
import User from "@/models/User";

export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { number, password, code } = validatedFields.data;
  const existingUser = await getUserByNumber(number);
  if (!existingUser || !existingUser.number || !existingUser.password) {
    return { error: "Number does not exist!" };
  }
  if (!existingUser.numberVerified && existingUser.number) {
    if (code) {
      const verificationToken = await getVerificationTokenByNumber(existingUser.number);
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
      await VerificationToken.findOneAndDelete({ number: existingUser.number });
      await User.findByIdAndUpdate(existingUser._id, { numberVerified: new Date() })
    } else {
      const verificationToken = await generateVerificationToken(existingUser.number);
      // Send the SMS using Twilio
      const smsResult = await sentSMS(number, `From WebPlus, Your One Time Password is ${verificationToken.token}. Please don't share this message.`);

      if (smsResult.error) {
        return { error: smsResult.message }; // Handle SMS sending error
      }
      return { success: "OTP sent!", Verification: true };
    }
  }

  try {
    await signIn("credentials", {
      number,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
    return { success: "You are Logged in!" }
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }

}