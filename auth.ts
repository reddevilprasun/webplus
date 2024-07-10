import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import github from "next-auth/providers/github"
import { LoginSchema } from "./schema"
import { getUserByNumber } from "./data/user"
import { MongoDBAdapter } from "@auth/mongodb-adapter"

import bcrypt from "bcryptjs"
import clientPromise from "./lib/db"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      credentials: {
        number: { type: "string" },
        password: { type: "string" }
      },
      authorize: async(credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {

          const {number , password} = validatedFields.data;
          console.log(validatedFields.data);

          const user = await getUserByNumber(number);
          console.log(user);
          if(!user || !user.password){
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            password,
            user.password
          );

          if(passwordMatch){
            return user;
          }

        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if(token.sub && session.user){
        session.user.id = token.sub;
      }
      return session;
    },
  },
})