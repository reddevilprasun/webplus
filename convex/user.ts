import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

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
