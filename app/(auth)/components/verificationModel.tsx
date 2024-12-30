//"use client";
import React from "react";
import { InputOtp } from "@nextui-org/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@nextui-org/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormValues {
  code: string;
  email: string;
}

interface VerificationModelProps {
  email: string;
  provider: string;
  handleCancel: () => void;
}
const VerificationModel = ({
  email,
  provider,
  handleCancel,
}: VerificationModelProps) => {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      email: email,
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

const onSubmit = (values: FormValues) => {
    if (!provider) {
      toast.error("Provider is not defined");
      return;
    }

    setSubmitting(true);
    signIn(provider, {
      email: values.email,
      code: values.code,
      flow: "email-verification",
    })
      .then(() => {
        router.push("/dashboard");
        toast.success("Successfully verified");
      })
      .catch((error) => {
        toast.error("Invalid OTP");
        console.error("VerificationModel Error: ", error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-4 w-full max-w-md p-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter the one-time password (OTP) sent to your registered device to
          continue.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <InputOtp
                {...field}
                errorMessage={errors.code?.message}
                isInvalid={!!errors.code}
                length={8}
                size="lg"
              />
            )}
            rules={{
              required: "OTP is required",
              minLength: {
                value: 4,
                message: "Please enter a valid OTP",
              },
            }}
          />
          <div className=" flex items-center justify-center space-x-4">
            <Button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
              type="submit"
              isLoading={submitting}
            >
              Confirm
            </Button>
            <Button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400 dark:focus:ring-offset-gray-800"
              onClick={handleCancel}
              isDisabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VerificationModel;
