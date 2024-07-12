"use server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schema";
import * as z from "zod";
import {AuthError} from "next-auth"

export const login = async (value: z.infer<typeof LoginSchema>)=>{
  const validatedFields = LoginSchema.safeParse(value);

  if (!validatedFields.success) {
    return {error: "Invalid fields!"};
  }

  const {number, password} = validatedFields.data;

  try {
    await signIn("credentials", {
      number,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
    return {success: "You are Logged in!"} 
  } catch (error:any) {
    if(error instanceof AuthError){
      console.log(error.type);
      switch (error.type){
        case "CallbackRouteError":
          return {error: "Invalid credentials!"};
        default:
          return {error: "Something went wrong!"};
      }
    }
    throw error;
  }

}