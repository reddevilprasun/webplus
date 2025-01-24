import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const storeLogInfo = httpAction(async (ctx, request) => {
  try {
    const body = await request.json();
    const { log, apiKey } = body;

    // Use a mutation to store the log information
    const logId = await ctx.runMutation(internal.internalMutations.storeLog, {
      log: {
        ip: log.ip,
        userAgent: log.userAgent,
        url: log.url,
        event: log.event,
        timestamp: log.timestamp,
        method: log.method,
        statusCode: log.statusCode,
        responseTime: log.responseTime,
        requestBody: log.requestBody,
        responseBody: log.responseBody,
      },
      apiKey,
    });

    return new Response(JSON.stringify({ success: true, logId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error storing log information:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to store log information" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});