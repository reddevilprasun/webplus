"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Doc } from "@/convex/_generated/dataModel";
import { useGetAllCoupons } from "../../services/api/use-getAll-coupons";
import { CouponTableSkeleton } from "../../services/components/admin/coupon-table-skeleton";
import { AddCouponForm } from "../../services/components/admin/Add-coupon-form";
import { format } from "date-fns";

type Coupon = Doc<"coupons">;

export default function CouponsPage() {
  const { data: coupons, isLoading } = useGetAllCoupons();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredCoupons = coupons?.filter((coupon) =>
    Object.values(coupon).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddCoupon = () => {};

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Coupon Management</h1>
      <div className="flex justify-between">
        <Input
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsDialogOpen(true)}>Add New Coupon</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Max Uses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <CouponTableSkeleton />
          ) : filteredCoupons?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No coupons found.
              </TableCell>
            </TableRow>
          ) : (
            filteredCoupons?.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discountPercentage}%</TableCell>
                <TableCell>
                  {format(new Date(coupon.validFrom), 'd MMMM, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.validUntil), 'd MMMM, yyyy')}
                </TableCell>
                <TableCell>{coupon.maxUses}</TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? "default" : "secondary"}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={coupon.isActive ? "destructive" : "default"}
                    onClick={() => {}}
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coupon</DialogTitle>
          </DialogHeader>
          <AddCouponForm
            onCancel={() => setIsDialogOpen(false)}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
