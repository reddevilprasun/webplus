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
    // other "users" fields...
  }).index("email", ["email"]),
});
 
export default schema;