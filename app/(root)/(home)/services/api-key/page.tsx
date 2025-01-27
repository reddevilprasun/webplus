"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUserSubscriptionType } from "@/app/(root)/features/getUserSubscriptionStatus";
import { useState } from "react";
import { useCreateNewApiKey } from "../api/use-new-apiKey";
import { RegenerateApiKeyDialog } from "../components/ApiKeyGenaratorModel";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import Link from "next/link";

export default function ApiKeyPage() {
  const { data: subscriptionType } = useGetUserSubscriptionType();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutated, isPending } = useCreateNewApiKey();

  if (subscriptionType?.subscriptionType !== "premium") {
    return (
      <div className="m-8">
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader>
            <CardTitle>Upgrade to Premium</CardTitle>
            <CardDescription className="text-white">
              Upgrade to a premium subscription to generate an API key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/services/purchase-plans">
            <Button
              className="bg-cyan-500 shadow-[1px_1px_14px_1px_#15dffa] text-white"
            >
              Upgrade to Premium
            </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <RegenerateApiKeyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          mutated({
            onSuccess: () => {
              toast.success("API Key regenerated successfully");
            },
            onError: (error) => {
              const errorMessage =
                error instanceof ConvexError
                  ? (error.data as string)
                  : "An error occurred";
              toast.error(errorMessage);
            },
            onSettled: () => {
              setIsDialogOpen(false);
            },
          });
        }}
      />
      <div className="space-y-6 m-8">
        <h1 className="text-3xl font-bold">API Key Management</h1>
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader>
            <CardTitle>Your API Key</CardTitle>
            <CardDescription className="text-white">
              Use this key to authenticate your API requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                value={
                  subscriptionType?.apiKey ||
                  "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                }
                readOnly
                className="text-white bg-transparent border-white"
              />
              <Button
                className="bg-cyan-500 shadow-[1px_1px_14px_1px_#15dffa] text-white"
                disabled={isPending}
                onClick={() => {
                  navigator.clipboard.writeText(
                    subscriptionType?.apiKey ||
                      "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  );
                  toast.success("API Key copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="bg-cyan-500 shadow-[1px_1px_14px_1px_#15dffa] text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              Regenerate API Key
            </Button>
          </CardFooter>
        </Card>
        <Card className="backdrop-blur-sm bg-white/20 text-white">
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription className="text-white">Your current API usage and limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Requests this month</span>
                <span className="font-semibold">5,432 / 10,000</span>
              </div>
              <div className="flex justify-between">
                <span>Data transferred</span>
                <span className="font-semibold">1.2 GB / 5 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
