import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const currentPremiumUserLogs = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {

    return await ctx.db
      .query("logInformation")
      .withIndex("by_userId", (q) => args.userId ? q.eq("userId", args.userId) : q)
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
