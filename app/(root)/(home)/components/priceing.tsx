import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "BASIC",
    price: "$9.99",
    description: "For individuals and small projects.",
    features: [
      "100,000 API requests per month",
      "Basic analytics",
      "1 team member",
      "24/7 support",
    ],
    button: "Purchase",
  },
  {
    name: "Pro",
    price: "$29.99",
    description: "For growing business",
    features: [
      "500,000 API requests per month",
      "Advanced analytics",
      "Priority support",
      "5 team member",
      "Custom domains",
    ],
    button: "Purchase",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large - scale applications",
    features: [
      "Unlimited API requests",
      "Real-time analytics",
      "Dedicated support",
      "Unlimited team member",
      "Custom integrations",
      "SLA",
    ],
    button: "Contact Sales",
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
            className={"relative rounded-2xl bg-gray-900/40 p-8 backdrop-blur-sm hover:shadow-[1px_1px_14px_1px_#15dffa] transition-all  duration-300"}
          >
            <div className=" flex flex-col items-center">
            <h3 className="text-lg text-center font-medium text-cyan-400">{plan.name}</h3>
            <div className="mt-5">
              <div className={cn("flex w-[280px] items-center justify-around gap-1 bg-[#171717] rounded-full p-2",
              plan.name === "Pro" && "bg-cyan-400 shadow-[1px_1px_14px_1px_#15dffa]"

               )}>
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                
                {plan.price !== "Custom" && (
                  <>
                  <span>
                  |
                </span>
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
