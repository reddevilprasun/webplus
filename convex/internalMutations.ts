import { internalMutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const storeLog = internalMutation({
  args: {
    log: v.object({
      ip: v.string(),
      userAgent: v.string(),
      url: v.string(),
      event: v.string(),
      timestamp: v.string(),
      method: v.optional(v.string()),
      statusCode: v.optional(v.number()),
      responseTime: v.optional(v.number()),
      requestBody: v.optional(v.union(v.string(), v.null())),
      responseBody: v.optional(v.union(v.string(), v.null())),
    }),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const { log, apiKey } = args;

    const user = await ctx.db.query("users").withIndex("apiKey", (q) => q.eq("apiKey", apiKey)).unique();
    if (!user) {
      throw new ConvexError("User not found");
    }
    if(user.subscriptionType === "free") {
      throw new ConvexError("User is not subscribed to Pro");
    }

    const logId = await ctx.db.insert("logInformation", {
      ...log,
      apiKey,
      userId: user._id,
    });

    return logId;
  },
});