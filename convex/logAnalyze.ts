import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

interface LogEntry {
  ip: string;
  datetime: Date;
  method: string;
  url: string;
  status: number;
  size: number;
  referrer: string;
  userAgent: string;
}

interface Report {
  totalRequests: number;
  uniqueIps: number;
  statusCodeDistribution: Record<number, number>;
  requestMethodDistribution: Record<string, number>;
  hourlyRequestDistribution: Record<number, number>;
  hourlyMethodDistribution: Record<number, Record<string, number>>;
  topRequestedUrls: Record<string, number>;
  requestsPerIp: Record<string, number>;
  anomalies: number;
  anomalyDetails: Array<Partial<LogEntry>>;
}

export const logAnalyze = mutation({
  args: {
    log: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const log = args.log;
    const logLines = log.split("\n"); // Split the file into lines

    const extractLogData = (logLine: string): LogEntry | null => {
      const logPattern =
        /(?<ip>\d+\.\d+\.\d+\.\d+) - - \[(?<datetime>.*?)\] "(?<method>\S+) (?<url>.*?) HTTP\/\d\.\d" (?<status>\d+) (?<size>\d+) "(?<referrer>.*?)" "(?<userAgent>.*?)"/;
      const match = logLine.match(logPattern);

      if (match && match.groups) {
        const datetimeString = match.groups.datetime;
        const parsedDatetime = parseLogDatetime(datetimeString);
        if (isNaN(parsedDatetime.getTime())) {
          console.error("Invalid datetime:", datetimeString);
          return null; // Return null if the date is invalid
        }
        return {
          ip: match.groups.ip,
          datetime: parsedDatetime,
          method: match.groups.method,
          url: match.groups.url,
          status: parseInt(match.groups.status, 10),
          size: parseInt(match.groups.size, 10),
          referrer: match.groups.referrer,
          userAgent: match.groups.userAgent,
        };
      }
      return null;
    };

    const parseLogDatetime = (datetimeString: string): Date => {
      const dateTimeWithTimezone = datetimeString.replace(
        /(\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2}:\d{2})(\s[+\-]\d{4})/,
        "$1$2" // Ensure proper formatting with timezone for Date constructor compatibility
      );
    
      const date = new Date(dateTimeWithTimezone);
    
      // If the date is invalid, return a fallback (e.g., current date), but you can also throw an error if needed
      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", datetimeString);
        return new Date(); // Fallback to current date
      }
    
      return date;
    };

    // Extract data from each line
    const logData: LogEntry[] = logLines
      .map(extractLogData)
      .filter((data): data is LogEntry => data !== null);

    // Function to detect anomalies (simple size outlier detection)
    // Detect anomalies based on size, status code, and rare methods
    const detectAnomalies = (logs: LogEntry[]): LogEntry[] => {
      const sizes = logs.map((log) => log.size);
      const avgSize = sizes.reduce((a, b) => a + b) / sizes.length;
      const stdDev = Math.sqrt(
        sizes
          .map((size) => Math.pow(size - avgSize, 2))
          .reduce((a, b) => a + b) / sizes.length
      );
      const sizeThreshold = avgSize + 2 * stdDev; // Adjusted threshold for size anomalies

      // Status codes considered anomalous (e.g., 4xx and 5xx are more likely to be anomalies)
      const anomalousStatusCodes = new Set([400, 403, 404, 500, 502, 503]);

      // Detect anomalies
      return logs.filter((log) => {
        // Detect if size is an anomaly
        const isSizeAnomaly = log.size > sizeThreshold;

        // Detect if status code is in the anomaly set
        const isStatusAnomaly = anomalousStatusCodes.has(log.status);

        // Detect if method is rare (other than GET, POST)
        const rareMethods = new Set(["PUT", "DELETE", "PATCH"]);
        const isMethodAnomaly = rareMethods.has(log.method);

        // If any of these criteria are met, consider it an anomaly
        return isSizeAnomaly || isStatusAnomaly || isMethodAnomaly;
      });
    };

    // Apply anomaly detection
    const anomalies = detectAnomalies(logData);

    // Group data into the report
    const report: Report = {
      totalRequests: logData.length,
      uniqueIps: new Set(logData.map((log) => log.ip)).size,
      statusCodeDistribution: logData.reduce(
        (acc, log) => {
          acc[log.status] = (acc[log.status] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>
      ),
      requestMethodDistribution: logData.reduce(
        (acc, log) => {
          acc[log.method] = (acc[log.method] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      hourlyRequestDistribution : logData.reduce(
        (acc, log) => {
          if (log.datetime instanceof Date && !isNaN(log.datetime.getTime())) {
            const hour = log.datetime.getHours();
            acc[hour] = (acc[hour] || 0) + 1;
          }
          return acc;
        },
        {} as Record<number, number>
      ),
      
      hourlyMethodDistribution: logData.reduce(
        (acc, log) => {
          if (log.datetime instanceof Date && !isNaN(log.datetime.getTime())) {
            const hour = log.datetime.getHours();
            if (!acc[hour]) acc[hour] = {};
            acc[hour][log.method] = (acc[hour][log.method] || 0) + 1;
          }
          return acc;
        },
        {} as Record<number, Record<string, number>>
      ),
      
      topRequestedUrls: Object.entries(
        logData.reduce(
          (acc, log) => {
            acc[log.url] = (acc[log.url] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .reduce(
          (acc, [url, count]) => {
            acc[url] = count;
            return acc;
          },
          {} as Record<string, number>
        ),
      requestsPerIp: logData.reduce(
        (acc, log) => {
          acc[log.ip] = (acc[log.ip] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      anomalies: anomalies.length,
      anomalyDetails: anomalies.map((anomaly) => ({
        ...anomaly,
      })),
    };

    const reportData = {
      userId,
      totalRequests: report.totalRequests,
      uniqueIps: report.uniqueIps,
      statusCodeDistribution: Object.fromEntries(
        Object.entries(report.statusCodeDistribution).map(([key, value]) => [
          key.toString(),
          value,
        ])
      ),
      requestMethodDistribution: report.requestMethodDistribution,
      hourlyRequestDistribution: Object.fromEntries(
        Object.entries(report.hourlyRequestDistribution).map(([key, value]) => [
          key.toString(),
          value,
        ])
      ),
      hourlyMethodDistribution: Object.fromEntries(
        Object.entries(report.hourlyMethodDistribution).map(
          ([hour, methods]) => [hour.toString(), methods]
        )
      ),
      topRequestedUrls: report.topRequestedUrls,
      requestsPerIp: report.requestsPerIp,
      anomalies: report.anomalies,
    };

    // Save the report to the database
    const reportId = await ctx.db.insert("report", reportData);

    // Insert anomaly details into the separate table
    for (const anomaly of report.anomalyDetails) {
      await ctx.db.insert("anomalyDetails", {
        reportId,
        ip: anomaly.ip,
        datetime: anomaly.datetime?.toString() ?? undefined,
        method: anomaly.method,
        url: anomaly.url,
        status: anomaly.status,
        size: anomaly.size,
        referrer: anomaly.referrer,
        userAgent: anomaly.userAgent,
      });
    }
    return reportId;
  },
});
