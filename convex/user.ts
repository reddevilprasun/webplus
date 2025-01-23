import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const generateApiKey = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
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

    return userId;
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

export const updateUserSubscriptionType = mutation({
  args: {
    couponCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError("User not found");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    if (user.subscriptionType === "premium") {
      throw new ConvexError("User is already subscribed to Pro");
    }

    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.couponCode.toUpperCase()))
      .unique();

    if (!coupon) {
      throw new ConvexError("Invalid coupon code");
    }

    if (coupon.isActive === false) {
      throw new ConvexError("Coupon code is not active");
    }

    await ctx.runMutation(internal.subscription.makeSubscriptionPro, { id: userId });

    await ctx.db.patch(coupon._id, { currentUses: coupon.currentUses + 1 });

    return userId;
  }
})