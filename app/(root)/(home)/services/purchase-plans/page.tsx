"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { get } from "http";
import { Alert } from "@heroui/react";
import { Check } from "lucide-react";
import { useGetUserSubscriptionType } from "@/app/(root)/features/getUserSubscriptionStatus";

// This is a mock function. In a real application, you would check the user's subscription status from your backend or a state management solution.

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    description: "For individuals and small projects",
    features: [
      "100,000 API requests per month",
      "Basic analytics",
      "24/7 support",
      "1 team member",
    ],
  },
  {
    name: "Pro",
    price: "$29.99",
    description: "For growing businesses",
    features: [
      "500,000 API requests per month",
      "Advanced analytics",
      "Priority support",
      "5 team members",
      "Custom domains",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale applications",
    features: [
      "Unlimited API requests",
      "Real-time analytics",
      "Dedicated support",
      "Unlimited team members",
      "Custom integrations",
      "SLA",
    ],
  },
];

const PurchasePlanPage = () => {
  const { data: userSubscription, isLoading } = useGetUserSubscriptionType();
  console.log("UserSubscription:", userSubscription);
  return (
    <div className=" space-y-6">
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
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-b from-cyan-600 to-sky-400">
                {plan.name === "Enterprise" ? "Contact Sales" : "Upgrade Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PurchasePlanPage;
