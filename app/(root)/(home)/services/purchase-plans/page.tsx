"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@heroui/react";
import { Check,X, ChevronDown, ChevronUp } from "lucide-react";
import { useGetUserSubscriptionType } from "@/app/(root)/features/getUserSubscriptionStatus";
import { PurchasePlanDialog } from "../components/PurchesPlanDialog";
import { toast } from "sonner";


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

const PurchasePlanPage = () => {
  const { data: userSubscription, isLoading } = useGetUserSubscriptionType();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({})

  const togglePlanExpansion = (planName: string) => {
    setExpandedPlans((prev) => ({ ...prev, [planName]: !prev[planName] }))
  }

  const handlePurchase = (planName: string) => {
    setSelectedPlan(planName);
    setIsDialogOpen(true);
  };

  const handlePurchaseSuccess = () => {
    toast.success("Purchase Successful", {
      description: `You've successfully upgraded to the ${selectedPlan} plan!`,
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <PurchasePlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onPurchase={handlePurchaseSuccess}
        planName={selectedPlan}
      />
      <div className=" space-y-6 m-8">
        <h1 className=" text-3xl font-bold">Upgrade Your Plan</h1>
        {userSubscription?.subscriptionType !== "premium" && (
          <Alert
            title="Upgrade Required"
            description="You need to upgrade to a premium plan to access all features. Choose a plan below to continue."
            variant="faded"
            color="danger"
          />
        )}
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs and take your project to the
          next level.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col backdrop-blur-sm bg-white/20">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="text-3xl font-bold mb-4">
                {plan.price}
                <span className="text-sm font-normal">/month</span>
              </div>
              <ul className="space-y-2">
                {plan.features.slice(0, expandedPlans[plan.name] ? undefined : 4).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>
              {plan.features.length > 4 && (
                <Button
                  variant="link"
                  onClick={() => togglePlanExpansion(plan.name)}
                  className="mt-2 p-0 h-auto font-normal"
                >
                  {expandedPlans[plan.name] ? (
                    <>
                      Show Less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-cyan-500 shadow-[1px_1px_14px_1px_#15dffa]"
                  onClick={() => handlePurchase(plan.name)}
                  disabled={
                    isLoading ||
                    userSubscription?.subscriptionType === "premium"
                  }
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Upgrade Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default PurchasePlanPage;
