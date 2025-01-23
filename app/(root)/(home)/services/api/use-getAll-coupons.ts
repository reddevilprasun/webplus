import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api";

export const useGetAllCoupons = () => {
  const data = useQuery(api.coupon.getCoupons);
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
}