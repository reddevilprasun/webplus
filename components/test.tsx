import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  color: string;
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "₹999",
    description: "For small businesses and startups",
    color: "bg-blue-500",
    features: [
      { text: "Web Dashboard for basic log monitoring", included: true },
      { text: "Basic security measures (WAF, SSL/TLS)", included: true },
      { text: "10 GB data storage for logs", included: true },
      { text: "Daily alerts and reports", included: true },
      { text: "Real-time log viewing", included: true },
      { text: "Basic AI-based threat detection", included: true },
      { text: "Limited Prometheus & Grafana access", included: true },
    ],
  },
  {
    name: "Standard",
    price: "₹3,499",
    description: "For mid-sized businesses",
    color: "bg-green-500",
    features: [
      { text: "Everything in Basic Plan", included: true },
      { text: "Advanced security (AWS WAF, Cloudflare DDoS)", included: true },
      { text: "Role-Based Access Control (RBAC)", included: true },
      { text: "50 GB data storage for logs", included: true },
      { text: "Hourly alerts and comprehensive reports", included: true },
      { text: "Advanced AI-based anomaly detection", included: true },
      {
        text: "Full Elastic Stack, Prometheus, Grafana access",
        included: true,
      },
      { text: "Message queue (Kafka/RabbitMQ)", included: true },
    ],
  },
  {
    name: "Pro",
    price: "₹7,999",
    description: "For large enterprises",
    color: "bg-purple-500",
    features: [
      { text: "Everything in Standard Plan", included: true },
      { text: "Unlimited data storage for logs", included: true },
      { text: "Real-time anomaly detection", included: true },
      { text: "Priority support and account management", included: true },
      { text: "Customizable dashboards", included: true },
      { text: "Automated DDoS mitigation (AWS Shield)", included: true },
      { text: "Custom alerts and reports", included: true },
      { text: "New Relic or Datadog integration", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: "₹19,999+",
    description: "For very large businesses",
    color: "bg-red-500",
    features: [
      { text: "Everything in Pro Plan", included: true },
      { text: "Custom security measures", included: true },
      { text: "On-premise or hybrid cloud deployment", included: true },
      { text: "Custom AI/ML models for threat detection", included: true },
      { text: "Full DevOps automation", included: true },
      { text: "Unlimited team members with full RBAC", included: true },
      { text: "Dedicated 24/7 support and SLA", included: true },
      { text: "Custom rate limiting and traffic management", included: true },
    ],
  },
];

export function Pricing() {
  return (
    <section className="container py-5 bg-[#1E2656]">
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
          PRICING TABLE
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Start Using Webplu+
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Choose the plan that best fits your needs and take your project to the
          next level.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              "relative rounded-2xl bg-gray-900/40 p-8 backdrop-blur-sm hover:shadow-[1px_1px_14px_1px_#15dffa] transition-all  duration-300"
            }
          >
            <div className=" flex flex-col items-center">
              <h3 className="text-lg text-center font-medium text-cyan-400">
                {plan.name}
              </h3>
              <div className="mt-5">
                <div
                  className={cn(
                    "flex w-[280px] items-center justify-around gap-1 bg-[#171717] rounded-full p-2",
                    plan.name === "Pro" &&
                      "bg-cyan-400 shadow-[1px_1px_14px_1px_#15dffa]"
                  )}
                >
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>

                  {plan.price !== "Custom" && (
                    <>
                      <span>|</span>
                      <span className="text-sm">/ per month</span>
                    </>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-300">{plan.description}</p>
              </div>
            </div>
            <ul className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                className={`w-full rounded-xl py-6 text-base font-medium ${
                  plan.highlighted
                    ? "bg-cyan-400 shadow-[1px_1px_14px_1px_#15dffa] text-gray-900 hover:bg-cyan-500"
                    : plan.name === "Enterprise"
                      ? "bg-gray-950 text-white hover:bg-gray-900"
                      : "bg-cyan-400/10 text-white hover:bg-cyan-400/20"
                }`}
              >
                {plan.button}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
