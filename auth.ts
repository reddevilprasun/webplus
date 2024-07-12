
import NextAuth, { DefaultSession} from "next-auth"
import { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import github from "next-auth/providers/github"
import { LoginSchema } from "./schema"
import { getUserById, getUserByNumber } from "./data/user"
import { MongoDBAdapter } from "@auth/mongodb-adapter"

import bcrypt from "bcryptjs"
import clientPromise from "./lib/db"
import { authConfig } from "./auth.config"


// Extend the default User type with the role property
declare module "next-auth" {

  interface Session {
    user: {
      id: string
      role: string
      number:string
      image:string
    } & DefaultSession["user"]
  }
  interface User {
    _id:string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    number:string
    image:string
  }
}



export const { handlers, signIn, signOut, auth } = NextAuth({
  //adapter: MongoDBAdapter(clientPromise),
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        number: { type: "string" },
        password: { type: "string" }
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {

          const { number, password } = validatedFields.data;
          console.log(validatedFields.data);

          const user = await getUserByNumber(number);
          console.log(user);
          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (passwordMatch) {
            return user;
          }

        }
        return null;
      }
    })
  ],
  callbacks: {
    // async signIn({user}){
    //   const existingUser = await getUserById(user._id);
    //   if(!existingUser || !existingUser.numberVerified){
    //     return false;
    //   }
    //   return true;
    // },
    
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if(token.number && session.user){
        session.user.number = token.number;
      }
      if(token.image && session.user){
        session.user.image = token.image;
      }
      if(token.name && session.user){
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user }) {
      if(user){
        token.sub = user._id;
      }
      if (!token.sub) return token;
      console.log({ token })
      const existingUser = await getUserById(token.sub);
      console.log("USER:", existingUser)
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.number = existingUser.number;
      token.image = existingUser.image;
      token.name = `${existingUser.firstName} ${existingUser.lastName}`
      return token;
    },
  },

})