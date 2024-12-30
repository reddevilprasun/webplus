import { useAuthActions } from "@convex-dev/auth/react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Input } from "@nextui-org/react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ForgetFormDataProps {
  email: string;
}

interface ForgetFormProps {
  handleCodeSent: (email: string) => void;
  handleCancel: () => void;
}

const ForgetForm = ({ handleCancel, handleCodeSent }: ForgetFormProps) => {
  const [submitting, setSubmitting] = React.useState(false);
  const { signIn } = useAuthActions();
  const forgetForm = useForm<ForgetFormDataProps>({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    ),

    defaultValues: {
      email: "",
    },
  });

  const onSubmitForget = async (values: ForgetFormDataProps) => {
    try {
      setSubmitting(true);
      console.log(values);
      await signIn("password-code", {
        email: values.email,
        flow: "reset",
      });
      toast.success("Reset code sent to your email");
      handleCodeSent(values.email);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center mb-4">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we&apos;ll send you a code to reset your
          password
        </p>
      </div>
      <Form {...forgetForm}>
        <form
          onSubmit={forgetForm.handleSubmit(onSubmitForget)}
          className="space-y-6 w-full"
        >
          <FormField
            name="email"
            control={forgetForm.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    type="email"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    isInvalid={
                      forgetForm.formState.errors.email?.message ? true : false
                    }
                    errorMessage={forgetForm.formState.errors.email?.message}
                    classNames={{
                      inputWrapper: ["bg-white"],
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <MemoizedButtons
            submitting={submitting}
            handleCancel={handleCancel}
          />
        </form>
      </Form>
    </>
  );
};

const MemoizedButtons = React.memo(
  ({
    submitting,
    handleCancel,
  }: {
    submitting: boolean;
    handleCancel: () => void;
  }) => (
    <div className="flex gap-6 items-center justify-center">
      <Button
        className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
        type="submit"
        isLoading={submitting}
      >
        Send Reset Code
      </Button>
      <Button
        className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400 dark:focus:ring-offset-gray-800"
        onClick={() => handleCancel()}
        isDisabled={submitting}
      >
        Cancel
      </Button>
    </div>
  )
);

MemoizedButtons.displayName = "MemoizedButtons";

export default ForgetForm;
