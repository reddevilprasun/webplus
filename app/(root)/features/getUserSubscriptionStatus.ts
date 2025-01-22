import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api";

export const useGetUserSubscriptionType = () => {
  const data = useQuery(api.user.getUserSubscriptionStatus);
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
}