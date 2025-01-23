import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { auth } from "./auth";

export const createCoupon = mutation({
  args: {
    code: v.string(),
    discountPercentage: v.number(),
    validFrom: v.number(),
    validUntil: v.number(),
    maxUses: v.number(),
    isActive: v.boolean(),
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
    if (user.userRole !== "admin") {
      throw new ConvexError("User does not have permission to create coupons");
    }
    const { code, discountPercentage, validFrom, validUntil, maxUses, isActive } = args;

    if(!code || code.length < 4 || code.length > 20 || !discountPercentage || !validFrom || !validUntil || !maxUses) {
      throw new ConvexError("Invalid coupon data");
    }

    if (validFrom > validUntil) {
      throw new ConvexError("Valid from date cannot be after valid until date");
    }

    if (maxUses <= 0) {
      throw new ConvexError("Max uses must be greater than 0");
    }

    if(discountPercentage <= 0 || discountPercentage > 100) {
      throw new ConvexError("Discount percentage must be between 1 and 100");
    }

    if (isActive && validFrom > Date.now()) {
      throw new ConvexError("Coupon cannot be active before valid from date");
    }

    if (isActive && validUntil < Date.now()) {
      throw new ConvexError("Coupon cannot be active after valid until date");
    }

    
    const newCouponId = await ctx.db.insert("coupons", {
      code : code.toUpperCase(),
      discountPercentage,
      validFrom,
      validUntil,
      maxUses,
      currentUses: 0, // Initialize with 0 uses
      isActive,
    });

    return newCouponId;
  },
});

export const updateCouponStatus = mutation({
  args: {
    id: v.id("coupons"),
    isActive: v.boolean(),
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
    if (user.userRole !== "admin") {
      throw new ConvexError("User does not have permission to update coupon status");
    }

    const { id, isActive } = args;
    await ctx.db.patch(id, { isActive });

    return id;
  },
});

export const getCoupons = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return [];
    }
    if (user.userRole !== "admin") {
      return [];
    }
    return await ctx.db.query("coupons").collect();
  },
});

export const verifyCoupon = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const { code } = args;
    const currentTime = Date.now();

    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!coupon) {
      return { valid: false, reason: "Coupon not found" };
    }

    if (!coupon.isActive) {
      return { valid: false, reason: "Coupon is not active" };
    }

    if (currentTime < coupon.validFrom) {
      return { valid: false, reason: "Coupon is not yet valid" };
    }

    if (currentTime > coupon.validUntil) {
      return { valid: false, reason: "Coupon has expired" };
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return { valid: false, reason: "Coupon usage limit reached" };
    }

    return {
      valid: true,
      discountPercentage: coupon.discountPercentage,
    };
  },
});