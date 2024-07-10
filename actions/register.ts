"use server";
import { RegisterSchema } from "@/schema";
import * as z from "zod";
import bcrypt from "bcryptjs"
import User from "@/models/User";
import { getUserByNumber } from "@/data/user";

import clientPromise from "@/lib/mongoose";
export const register = async (value: z.infer<typeof RegisterSchema>)=>{
  const validatedFields = RegisterSchema.safeParse(value);

  if (!validatedFields.success) {
    return {error: "Invalid fields!"};
  }

  const {number, firstName, lastName , password} = validatedFields.data;
  const hashedPassword  = await bcrypt.hash(password, 10);
  await clientPromise;

  const existingUser = await getUserByNumber(number);
  if (existingUser) {
    return  {error: "Number already in use!" }
  }
  const user = new User({number, firstName, lastName, password: hashedPassword});

  //TODO: Send OTP 
  await user.save();
  return {success: "OTP sent!"};

}