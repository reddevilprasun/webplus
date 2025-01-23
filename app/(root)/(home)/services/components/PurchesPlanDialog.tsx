"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUpdateSubscription } from "../api/use-update-subscription";
import { ConvexError } from "convex/values";

interface PurchasePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  planName: string | null;
}

export function PurchasePlanDialog({
  isOpen,
  onClose,
  onPurchase,
  planName,
}: PurchasePlanDialogProps) {
  const [couponCode, setCouponCode] = useState("");

  const { mutated, isPending } = useUpdateSubscription();

  const handlePurchase = async () => {
    if (!planName) {
      return;
    }
    if(!couponCode){
      toast.error("Please enter a coupon code");
      return;
    }
    mutated(
      { couponCode },
      {
        onSuccess: () => {
          onPurchase();
        },
        onError: (error) => {
          const errorMessage =
            error instanceof ConvexError
              ? (error.data as string)
              : "An error occurred";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {planName} Plan</DialogTitle>
          <DialogDescription>
            Enter your payment details and coupon code (if available) to
            complete your purchase.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coupon" className="text-right">
              Coupon Code
            </Label>
            <Input
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="col-span-3"
            />
          </div>
          {/* Add more fields for payment information here */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={isPending}>
            {isPending ? "Processing..." : "Complete Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
