"use client";
import * as z from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { LoginSchema } from "@/schema";
import { Button, Checkbox, Input, InputOtp } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ForgetForm from "./forgetForm";

interface LogInFormProps {
  handleSignUp: () => void;
}

interface VerificationForm {
  newPassword: string;
  code: string;
  email: string;
}

const LogInForm = ({ handleSignUp }: LogInFormProps) => {
  const [flow, setFlow] = useState<"signIn" | "forget" | "forgetPasswordVerification">(
    "signIn"
  );
  const [verifyEmail, setVerifyEmail] = useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const { signIn } = useAuthActions();
  const router = useRouter();

  //For Social login
  const handleProviderSignUp = async (provider: "google" | "github") => {
    try {
      await signIn(provider);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // for password visibility
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // for form validation

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const verificationForm = useForm<VerificationForm>({
    resolver: zodResolver(
      z.object({
        newPassword: z.string().min(8, "Password should be at least 8 characters long"),
        code: z.string().min(8, "Please enter a valid OTP"),
        email: z.string().email("Invalid email address"),
      })
    ),
    defaultValues: {
      newPassword: "",
      code: "",
      email: verifyEmail,
    },
  });

  const onSubmitVerification = async (values: VerificationForm) => {
    try {
      setSubmitting(true);
      await signIn("password-code", {
        email: values.email,
        newPassword: values.newPassword,
        code: values.code,
        flow: "reset-verification",
      });
      router.push("/sign-up");
      toast.success("Successfully verified");
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setSubmitting(true);
      await signIn("password-code", {
        email: values.email,
        password: values.password,
        flow: "signIn",
      });
      router.push("/dashboard");
      toast.success("Successfully signed in");
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return flow === "signIn" ? (
    <>
      <div className="flex flex-col items-center mb-4">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>

        <span className=" text-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          Or{" "}
          <span
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
            onClick={handleSignUp}
          >
            &nbsp;sign up for a new account
          </span>
        </span>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Phone Number"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    isInvalid={
                      form.formState.errors.email?.message ? true : false
                    }
                    errorMessage={form.formState.errors.email?.message}
                    classNames={{
                      inputWrapper: ["bg-white"],
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    name="password"
                    placeholder="Password"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    radius="sm"
                    size="md"
                    isInvalid={
                      form.formState.errors.password?.message ? true : false
                    }
                    errorMessage={form.formState.errors.password?.message}
                    classNames={{
                      inputWrapper: ["bg-white"],
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center ">
              <MemorizeCheckBox id="remember-me" name="remember-me" />
              <label
                className="block text-sm text-gray-900 dark:text-gray-100"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm cursor-pointer">
              <p
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setFlow("forget")}
              >
                Forgot your password?
              </p>
            </div>
          </div>
          <Button
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
            type="submit"
            isLoading={submitting}
          >
            Sign in
          </Button>
          <SocialLoginButtons
            handleProviderSignUp={handleProviderSignUp}
            submitting={submitting}
            />
        </form>
      </Form>
    </>
  ) : flow === "forget" ? (
    <ForgetForm
      handleCodeSent={(email) => {
        setVerifyEmail(email);
        setFlow("forgetPasswordVerification");
      }}
      handleCancel={() => setFlow("signIn")}
    />
  ) : (
    <>
      <div className="flex flex-col items-center mb-4">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter the one-time password (OTP) sent to your registered device to
          continue.
        </p>
      </div>
      <form
        onSubmit={verificationForm.handleSubmit(onSubmitVerification)}
        className="flex flex-col space-y-4 w-full items-center"
      >
        <Controller
          control={verificationForm.control}
          name="code"
          render={({ field }) => (
            <InputOtp
              {...field}
              errorMessage={verificationForm.formState.errors.code?.message}
              isInvalid={!!verificationForm.formState.errors.code}
              length={8}
              size="lg"
            />
          )}
          rules={{
            required: "OTP is required",
            minLength: {
              value: 8,
              message: "Please enter a valid OTP",
            },
          }}
        />
        <Controller
          control={verificationForm.control}
          name="newPassword"
          render={({ field }) => (
            <Input
              {...field}
              name="newPassword"
              placeholder="New Password"
              type="password"
              variant="bordered"
              radius="sm"
              size="md"
              isInvalid={
                verificationForm.formState.errors.newPassword?.message
                  ? true
                  : false
              }
              errorMessage={
                verificationForm.formState.errors.newPassword?.message
              }
              classNames={{
                inputWrapper: ["bg-white"],
              }}
            />
          )}
          rules={{
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Password should be at least 8 characters long",
            },
          }}
        />
        <MemoizedVerificationButtons
          submitting={submitting}
          setFlow={setFlow}
          />
      </form>
    </>
  );
};

interface SocialLoginButtonsProps {
  handleProviderSignUp: (provider: "google" | "github") => void;
  submitting: boolean;
}

const SocialLoginButtons = React.memo(
  ({ handleProviderSignUp, submitting }: SocialLoginButtonsProps) => (
    <div className="flex items-center justify-center space-x-4">
      <Button
        onClick={() => handleProviderSignUp("google")}
        className="flex w-full items-center border-white justify-center gap-2"
        variant="bordered"
        isDisabled={submitting}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        onClick={() => handleProviderSignUp("github")}
        className="flex w-full items-center border-white justify-center gap-2"
        variant="bordered"
        isDisabled={submitting}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  )
);
SocialLoginButtons.displayName = "SocialLoginButtons";



const MemorizeCheckBox = React.memo(Checkbox);

const MemoizedVerificationButtons = React.memo(
  ({ submitting, setFlow }: { submitting: boolean; setFlow: (flow: "signIn") => void }) => (
    <div className="flex items-center justify-center space-x-4 w-full">
      <Button
        className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
        type="submit"
        isLoading={submitting}
      >
        Confirm
      </Button>
      <Button
        className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400 dark:focus:ring-offset-gray-800"
        onClick={() => setFlow("signIn")}
        isDisabled={submitting}
      >
        Cancel
      </Button>
    </div>
  )
);
MemoizedVerificationButtons.displayName = "MemoizedVerificationButtons";

export default LogInForm;
