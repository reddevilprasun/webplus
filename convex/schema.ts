import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    image: v.optional(v.string()),
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    userRole: v.union(v.literal("admin"), v.literal("user")),
    subscriptionType: v.union(v.literal("free"), v.literal("premium")),
    apiKey: v.optional(v.string()),
    // other "users" fields...
  }).index("email", ["email"]),
  report: defineTable({
    userId: v.id("users"),
    totalRequests: v.number(),
    uniqueIps: v.number(),
    statusCodeDistribution: v.record(v.string(), v.number()),
    requestMethodDistribution: v.record(v.string(), v.number()),
    hourlyRequestDistribution: v.record(v.string(), v.number()),
    hourlyMethodDistribution: v.record(
      v.string(),
      v.record(v.string(), v.number())
    ),
    topRequestedUrls: v.record(v.string(), v.number()),
    requestsPerIp: v.record(v.string(), v.number()),
    anomalies: v.number(),
  }).index("by_userId", ["userId"]),
  anomalyDetails: defineTable({
    reportId: v.id("report"),
    ip: v.optional(v.string()),
    datetime: v.optional(v.string()),
    method: v.optional(v.string()),
    url: v.optional(v.string()),
    status: v.optional(v.number()),
    size: v.optional(v.number()),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  }).index("by_reportId", ["reportId"]),
  coupons: defineTable({
    code: v.string(),
    discountPercentage: v.number(),
    validFrom: v.number(), // Unix timestamp
    validUntil: v.number(), // Unix timestamp
    maxUses: v.number(),
    currentUses: v.number(),
    isActive: v.boolean(),
  }).index("by_code", ["code"]),
});

export default schema;
