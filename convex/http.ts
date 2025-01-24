import { httpRouter } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors";
import { auth } from "./auth";
import { storeLogInfo } from "./storeLogInfo";

const http = httpRouter();
const cors = corsRouter(http, {
  allowedOrigins: ["*"],
  allowedHeaders: ["Content-Type"],
});

auth.addHttpRoutes(http);

cors.route({
  path: "/log-analyze",
  method: "POST",
  handler: storeLogInfo,
});

export default http;
