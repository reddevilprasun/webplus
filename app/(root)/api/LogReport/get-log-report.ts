import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface LogReport {
  id: Id<"report">;
}

export const useGetLogReport = ({
  id
}: LogReport) => {
  const data = useQuery(api.logAnalyze.getReportWithAnomalyDetails, {
    reportId: id
  });
  const isLoading = data === undefined;
  return {
    data,
    isLoading,
  };
}