import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const currentPremiumUserLogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("logInformation")
      .withIndex("by_userId", (q) =>
        args.userId ? q.eq("userId", args.userId) : q
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getTotalRequests = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return 0;
    }
    const totalRequests = await ctx.db
      .query("logInformation")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    return totalRequests.length;
  },
});

export const getEventTypeBreakdown = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const events = await ctx.db
    .query("logInformation")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

    const eventTypeBreakdown = events.reduce((acc: { [key: string]: number }, event) => {
      const eventType = event.event;
      if (!acc[eventType]) {
        acc[eventType] = 1;
      } else {
        acc[eventType] += 1;
      }
      return acc;
    }, {});
    return eventTypeBreakdown;
  },
})

export const getRequestFrequency = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const events = await ctx.db
    .query("logInformation")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

    const requestFrequency = events.reduce((acc: { [key: string]: number }, event) => {
      const hour = new Date(event.timestamp).getHours();
      if (!acc[hour]) {
        acc[hour] = 1;
      } else {
        acc[hour] += 1;
      }
      return acc;
    }, {});
    return requestFrequency;
  },
})

export const getGeolocationData = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const events = await ctx.db
    .query("logInformation")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

    const geolocationData = events.reduce((acc: { [key: string]: number }, event) => {
      const ip = event.ip;
      if (!acc[ip]) {
        acc[ip] = 1;
      } else {
        acc[ip] += 1;
      }
      return acc;
    }, {});
    return geolocationData;
  },
})

export const getStatusCodeBreakdown = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    const events = await ctx.db
    .query("logInformation")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

    const statusCodeBreakdown = events.reduce((acc: { [key: string]: number }, event) => {
      const statusCode = event.statusCode;
      if (statusCode !== undefined) {
        if (!acc[statusCode]) {
          acc[statusCode] = 1;
        } else {
          acc[statusCode] += 1;
        }
      }
      return acc;
    }, {});
    return statusCodeBreakdown;
  },
})