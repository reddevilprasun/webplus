import { internalMutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const makeSubscriptionPro = internalMutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new ConvexError("User not found");
    }
    if (user.subscriptionType === "premium") {
      throw new ConvexError("User is already subscribed to Pro");
    }
    await ctx.db.patch(args.id, {
      subscriptionType: "premium",
    });
  },
});
