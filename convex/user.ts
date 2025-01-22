import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

const generateApiKey = () => {
  return Math.random().toString(36).substr(2, 10);
}

export const createApiKey = mutation({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId ) {
      throw new ConvexError("User not found");
    }
    const user = await ctx.db.get(userId);
    if(!user) {
      throw new ConvexError("User not found");
    }
    if(user.subscriptionType !== "premium") {
      throw new ConvexError("User does not have a premium subscription");
    }

    const apiKey = generateApiKey();
    await ctx.db.patch(userId, { apiKey });

    return apiKey;
  },
})

export const findUserByEmail = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email!))
      .first();
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const getUserSubscriptionStatus = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    return {
      subscriptionType: user.subscriptionType,
      apiKey: user.apiKey,
    }
  },
})