import NextAuth, { AuthError, DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import github from "next-auth/providers/github"
import { LoginSchema } from "./schema"
import { getUserByEmail, getUserById, getUserByNumber } from "./data/user"

import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import google from "next-auth/providers/google"
import User from "./models/User"
import facebook from "next-auth/providers/facebook"


// Extend the default User type with the role property
declare module "next-auth" {

  interface Session {
    user: {
      id: string
      role: string
      number: string
      image: string
      name:string
      email:string
    } & DefaultSession["user"]
  }
  interface User {
    _id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    number: string
    image: string
  }
}



export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    //Login user using OAuth
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    // Login User using only credentials
    Credentials({
      credentials: {
        number: { type: "string" },
        password: { type: "string" }
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {

          const { number, password } = validatedFields.data;

          const user = await getUserByNumber(number);
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
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  callbacks: {
    //For Sign In Conditions
    signIn: async ({ user, account, profile }) => {
      // To save the OAuth login user in the data base
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          let existingUser = await getUserByEmail(profile?.email);
          if (existingUser) {
            if (existingUser.provider !== account.provider) {
              return false;
            }
          }
          if (!existingUser) {
            // Create a new user
            existingUser = new User({
              firstName: profile?.given_name,
              lastName: profile?.family_name,
              email: profile?.email,
              password: "",
              role: "USER",
              image: profile?.picture,
              provider: account.provider,
              number:account.provider,
            });
            await existingUser.save();
          }

          return true;
        } catch (error: any) {
          throw new AuthError("Error while creating user")
        }

      }
      if (account?.provider === "credentials") {
        const existingUser = await getUserById(user._id!)
        // Prevent sign in without email verification
        if (!existingUser?.numberVerified) return false;
      }

      return true;

    },

    //Extends the session of user using some more information
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (token.number && session.user) {
        session.user.number = token.number;
      }
      if (token.image && session.user) {
        session.user.image = token.image;
      }
      if (token.name && session.user) {
        session.user.name = token.name;
      }
      return session;
    },
    // setUp the session token
    async jwt({ token, user }) {
      if (user) {
        token.sub = user._id;
      }
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.number = existingUser.number;
      token.image = existingUser.image;
      token.name = `${existingUser.firstName} ${existingUser.lastName}`
      return token;
    },
  },

})