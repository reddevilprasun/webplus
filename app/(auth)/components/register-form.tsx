"use client";
import React, { useState, useTransition } from "react";
import * as z from "zod";
import { RegisterSchema } from "@/schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuthActions } from "@convex-dev/auth/react";
import VerificationModel from "./verificationModel";
import LogInForm from "./login-form";

const SignUpForm = () => {
  const [flow, setFlow] = useState<
    "signUp" | "signIn" | "forget" | "verify" | "success"
  >("signUp");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const { signIn } = useAuthActions();
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmitSignup = async (value: z.infer<typeof RegisterSchema>) => {
    try {
      setSubmitting(true);
      await signIn("password-code", {
        email: value.email,
        password: value.password,
        firstName: value.firstName,
        lastName: value.lastName,
        flow: "signUp",
      });

      toast.success("Verification code sent to your email");
      setEmail(value.email);
      setFlow("verify");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center rounded-3xl bg-white/70 py-6 px-6 shadow-lg dark:bg-gray-800">
      <MemoizedImage />

      {flow === "signUp" ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Sign up for a new account
            </h2>

            <span className="mt-2 w-full text-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              &nbsp;Already have an account?
              <span
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setFlow("signIn")}
              >
                Sign in
              </span>
            </span>
          </div>
          <form onSubmit={handleSubmit(onSubmitSignup)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <Input
                    {...field}
                    name="firstName"
                    placeholder="First Name"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    isInvalid={errors.firstName?.message ? true : false}
                    errorMessage={errors.firstName?.message}
                    classNames={{
                      inputWrapper: ["bg-white"],
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <Input
                    {...field}
                    name="last-name"
                    placeholder="Last Name"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    size="md"
                    isInvalid={errors.lastName?.message ? true : false}
                    errorMessage={errors.lastName?.message}
                    classNames={{
                      inputWrapper: ["bg-white"],
                    }}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  name="email"
                  placeholder="example@mail.com"
                  type="text"
                  variant="bordered"
                  radius="sm"
                  size="md"
                  isInvalid={errors.email?.message ? true : false}
                  errorMessage={errors.email?.message}
                  classNames={{
                    inputWrapper: ["bg-white"],
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  name="password"
                  placeholder="Password"
                  type={isVisible ? "text" : "password"}
                  variant="bordered"
                  radius="sm"
                  size="md"
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
                  isInvalid={errors.password?.message ? true : false}
                  errorMessage={errors.password?.message}
                  classNames={{
                    inputWrapper: ["bg-white"],
                  }}
                />
              )}
            />

            <div>
              <MemoizedLoginButton
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
                type="submit"
                isLoading={submitting}
              >
                Sign up
              </MemoizedLoginButton>
            </div>
            <SocialLoginButtons
              handleProviderSignUp={handleProviderSignUp}
              submitting={submitting}
            />
          </form>
        </>
      ) : flow === "verify" ? (
        <VerificationModel
          email={email}
          provider="password-code"
          handleCancel={() => setFlow("signIn")}
        />
      ) : flow === "signIn" ? (
        <LogInForm handleSignUp={() => setFlow("signUp")} />
      ) : (
        <div className="flex items-center justify-center flex-col space-y-4">
          <CircleCheckIcon className="text-green-500 size-20" />
          <h1 className="text-2xl font-bold text-green-500">
            Account created successfully
          </h1>
        </div>
      )}
    </div>
  );
};

const MemoizedImage = React.memo(() => (
  <Image src={"/icons/logo.png"} width={280} height={280} alt="Logo" />
));
MemoizedImage.displayName = "MemoizedImage";

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

const MemoizedLoginButton = React.memo(Button);

export default SignUpForm;
