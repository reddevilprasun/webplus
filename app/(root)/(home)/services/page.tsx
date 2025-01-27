"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { useGetUserSubscriptionType } from "../../features/getUserSubscriptionStatus";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { Footer } from "../components/footer";

const benefits = [
  "Advanced Analytics Dashboard",
  "Unlimited API Requests",
  "24/7 Priority Support",
  "Custom Integrations",
  "Team Collaboration Tools",
  "Enhanced Security Features",
];

const testimonials = [
  {
    quote:
      "Webplus has revolutionized how we handle our API management. It's a game-changer!",
    author: "Jane Doe, CTO of TechCorp",
  },
  {
    quote:
      "The analytics provided by Webplus have given us insights we never knew we needed. Highly recommended!",
    author: "John Smith, Lead Developer at InnovateCo",
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function LandingPage() {
  const { data, isLoading } = useGetUserSubscriptionType();
  const totalRequests = useQuery(api.premium.getTotalRequests);
  const eventTypeBreakdown = useQuery(api.premium.getEventTypeBreakdown);
  const requestFrequency = useQuery(api.premium.getRequestFrequency);
  const geolocationData = useQuery(api.premium.getGeolocationData);
  const statusCodeBreakdown = useQuery(api.premium.getStatusCodeBreakdown);

  console.log(
    "Total Requests",
    totalRequests,
    "Event Type Breakdown",
    eventTypeBreakdown,
    "Request Frequency",
    requestFrequency,
    "Geolocation Data",
    geolocationData,
    "Status Code Breakdown",
    statusCodeBreakdown
  );
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  if (data?.subscriptionType !== "premium") {
    return (
      <div className="min-h-screen text-white">
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
              Supercharge Your API Management
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-50">
              Webplus provides powerful tools for API analytics, monitoring, and
              optimization. Take control of your APIs and boost your
              application&apos;s performance.
            </p>
            <div className="mt-8">
              <Link href="/dashboard/purchase-plans">
                <Button
                  size="lg"
                  className="text-lg px-8 py-3 bg-cyan-500 shadow-[1px_1px_14px_1px_#15dffa]"
                >
                  Upgrade to Premium <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              Premium Benefits
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="backdrop-blur-sm bg-white/20 hover:shadow-[1px_1px_14px_1px_#15dffa] border-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      {benefit}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Unlock the full potential of your APIs with our premium
                      features.
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              What Our Customers Say
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="backdrop-blur-sm bg-white/20 hover:shadow-[1px_1px_14px_1px_#15dffa] border-white">
                  <CardContent className="pt-8">
                    <p className="text-lg font-medium mb-4">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <p className="text-base text-gray-50">
                      - {testimonial.author}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-gray-50 mb-8">
              Join thousands of developers who trust Webplus for their API
              management needs.
            </p>
            <Link href="/services/purchase-plans">
              <Button
                size="lg"
                className="text-lg px-8 py-3 bg-cyan-500 shadow-[1px_1px_14px_1px_#15dffa]"
              >
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </main>

        <Footer/>
      </div>
    );
  }

  const eventTypeBreakdownChartData = Object.entries(
    eventTypeBreakdown ?? {}
  ).map(([eventType, count]) => ({
    eventType,
    count,
  }));
  const totalEvents = Object.values(eventTypeBreakdown ?? {}).reduce(
    (acc, count) => acc + count,
    0
  );

  const statusCodeBreakdownChartData = Object.entries(
    statusCodeBreakdown ?? {}
  ).map(([statusCode, count]) => ({
    statusCode,
    count,
  }));

  const requestFrequencyChartData = Object.entries(requestFrequency ?? {}).map(
    ([time, count]) => ({
      time,
      count,
    })
  );

  return (
    <div className="space-y-6 m-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-green-500">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {geolocationData ? Object.keys(geolocationData).length : 0}
            </div>
            <p className="text-xs text-green-500">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">230ms</div>
            <p className="text-xs text-rose-600">-5% from last month</p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-500">+2 from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col backdrop-blur-sm bg-white/20 text-white">
          <CardHeader className="items-center pb-0">
            <CardTitle>Pie Chart - Event Breakdown</CardTitle>
            <CardDescription className=" text-white">Event tracking data from API</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={{}}
              className="mx-auto aspect-square max-h-[250px] text-white"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={eventTypeBreakdownChartData}
                  dataKey="count"
                  nameKey="eventType"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {eventTypeBreakdownChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    className="text-white"
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
                              className="text-white text-3xl font-bold"
                            >
                              {totalEvents}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="text-white"
                            >
                              Total Events
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
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none text-green-500">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-white">
              Displaying event breakdown from API data.
            </div>
          </CardFooter>
        </Card>
        <Card className="flex flex-col backdrop-blur-sm bg-white/20 text-white">
          <CardHeader className="items-center pb-0">
            <CardTitle>Line Chart - Request Frequency</CardTitle>
            <CardDescription className="text-white">Request frequency data from API</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={{
                desktop: {
                  label: "Desktop",
                  color: "#0088FE",
                },
              }}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <LineChart
                data={requestFrequencyChartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
                className="text-white"
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="count"
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none text-green-500">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-white">
              Displaying request frequency data from API.
            </div>
          </CardFooter>
        </Card>
        {/* Status Code Breakdown (Bar Chart) */}
        <Card className="flex flex-col backdrop-blur-sm bg-white/20 text-white">
          <CardHeader className="items-center pb-0">
            <CardTitle>Bar Chart - Status Code Breakdown</CardTitle>
            <CardDescription className="text-white">HTTP status codes distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={{
                200: {
                  label: "200",
                  color: "#0088FE",
                },
                404: {
                  label: "404",
                  color: "#00C49F",
                },
                500: {
                  label: "500",
                  color: "#FFBB28",
                },
              }}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <BarChart data={statusCodeBreakdownChartData} className="text-white">
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="statusCode"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-white"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" radius={8} strokeWidth={2} 
                fill="#0088FE"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none text-green-500">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-white">
              Displaying status code breakdown from API data.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
