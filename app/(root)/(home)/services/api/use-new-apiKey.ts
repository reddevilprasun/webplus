import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";


type Options = {
  onSuccess?: (data: string) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useNewJoinCode = () => {
  const [data, setData] = useState<string>();
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.user.createApiKey);

  const mutated = useCallback(
    async (options?: Options) => {
      try {
        setData(undefined);
        setError(null);
        setStatus("pending");
        const response = await mutation();
        options?.onSuccess?.(response);
        setData(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
        setError(error as Error);
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutated,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};