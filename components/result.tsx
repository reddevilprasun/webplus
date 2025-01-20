import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AnomalyPage from "./ananomy";
import { Id } from "@/convex/_generated/dataModel";
import { useGetLogReport } from "@/app/(root)/api/LogReport/get-log-report";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  reportId: Id<"report">;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const ReportPage = ({ reportId }: Props) => {
  const { data: reportData } = useGetLogReport({ id: reportId });

  if (!reportId)
    return <p className="text-center text-red-500">No report found</p>;

  // Calculate errors, warnings, and informational logs
  const errors = Object.entries(
    reportData?.statusCodeDistribution || {}
  ).reduce((acc, [code, count]) => {
    if (Number(code) >= 400 && Number(code) < 500) {
      return acc + count;
    }
    return acc;
  }, 0);

  const warnings = Object.entries(
    reportData?.statusCodeDistribution || {}
  ).reduce((acc, [code, count]) => {
    if (Number(code) >= 500) {
      return acc + count;
    }
    return acc;
  }, 0);

  const info = Object.entries(reportData?.statusCodeDistribution || {}).reduce(
    (acc, [code, count]) => {
      if (Number(code) >= 200 && Number(code) < 300) {
        return acc + count;
      }
      return acc;
    },
    0
  );

  const statusCodeData = Object.entries(
    reportData?.statusCodeDistribution || {}
  ).map(([name, value]) => ({ name: name.toString(), value }));
  console.log("Status Code Data:", statusCodeData);

  const topUrlsData = Object.entries(reportData?.topRequestedUrls || {}).map(
    ([name, value]) => ({ name, value })
  );
  const methodData = Object.entries(
    reportData?.requestMethodDistribution || {}
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex flex-col gap-8 m-4">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Web Traffic Analytics</CardTitle>
          <CardDescription>
            Total Requests: {reportData?.totalRequests} | Unique IPs: {reportData?.uniqueIps} | Anomalies: {reportData?.anomalies}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {reportData?.totalRequests}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{errors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{warnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{info}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Log Data Visualization</CardTitle>
          <CardDescription>
            Analyze your log data with interactive charts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Requested URLs</CardTitle>
                <CardDescription>Most frequently accessed URLs</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topUrlsData}
                      layout="vertical"
                      margin={{
                        left: -20,
                      }}
                    >
                      <XAxis type="number" dataKey="value" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Bar dataKey="value" fill="#1e9cfe" radius={5} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Status Code Distribution</CardTitle>
                <CardDescription>
                  HTTP status codes distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={{}}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={statusCodeData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={1}
                      label={({ name, percent }) => `${name}`}
                    >
                      {statusCodeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {reportData?.totalRequests}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Requests
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Request Methods</CardTitle>
                <CardDescription>
                  Distribution of HTTP request methods
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={methodData}
                      layout="vertical"
                      margin={{
                        left: -20,
                      }}
                    >
                      <XAxis type="number" dataKey="value" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="value" radius={5} layout="vertical">
                        {methodData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]} // Assign unique color from COLORS array
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

     <Card>
        <CardHeader>
          <CardTitle>Log Anomalies</CardTitle>
          <CardDescription>View detected anomalies in your log data</CardDescription>
        </CardHeader>
      </Card>
     
      {reportId && <AnomalyPage reportId={reportId} reportData={reportData} />}
    </div>
  );
};

export default ReportPage;
