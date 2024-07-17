"use client";
import { ForgetPasswordSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { Button, Input } from '@nextui-org/react';
import Image from 'next/image';
import React, { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { CircleCheckIcon, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { forger } from '@/actions/forgetpassword';
import { toast } from 'sonner';

const ForgetPasswordComponent = () => {

  const [showVerificationModel, setShowVerificationModel] = useState(false);
  const [showSuccessModel, setShowSuccessModel] = useState(false);
  const [showPasswordModel, setShowPasswordModel] = useState(false);

  // for password visibility
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isPending, startTransition] = useTransition();

  //for form validation
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof ForgetPasswordSchema>>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      number: '',
    }
  })

  //handle Submit
  const onSubmit = async (values: z.infer<typeof ForgetPasswordSchema>) => {
    startTransition(() => {
      forger(values)
      .then((data) => {
        if(data.success){
          toast.success(data.success);
        }
        if(data.error){
          toast.error(data.error);
        }
        if(data.Verification){
          setShowVerificationModel(true);
        }
        if(data.verificationSuccess){
          setShowPasswordModel(true);
          setShowVerificationModel(false);
        }
        if(data.passwordResetSuccess){
          setShowSuccessModel(true);
          setShowPasswordModel(false);
        }
      })
      .catch((error) => {
        // Handle any unexpected errors
        console.error('An error occurred:', error);
        toast.error('An error occurred while Changing password');
      });
    })
  }


  return (
    <div className="mx-auto w-full max-w-md space-y-8 rounded-3xl bg-white/70 p-8 shadow-lg dark:bg-gray-800">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Image
            src={"/icons/logo.png"}
            width={280}
            height={280}
            alt="Logo"
          />
        </div>
        {showSuccessModel && (
          <CircleCheckIcon className="mx-auto h-12 w-12 text-green-500" />
        )}
        {showSuccessModel && (
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Done
          </h2>
        )}
        {showPasswordModel === true ? (
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Enter New Password
          </h2>
        ) : !showSuccessModel && (
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Forgot Password
          </h2>
        )}

        {showSuccessModel && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Your password reset successfully
          </p>
        )}

        {showPasswordModel === true ? (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your new strong password
          </p>
        ) : !showSuccessModel && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We&apos;ll send you a OTP to get back into your account.
          </p>
        )}


      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {showPasswordModel && (
          <Controller
            name="password"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                name="password"
                placeholder="Password"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                radius="sm"
                size='md'
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
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
                  inputWrapper: ["bg-white"]
                }}
              />
            }
          />
        )}
        {showVerificationModel && (
          <Controller
            control={control}
            name="code"
            render={({ field }) =>
              <Input
                {...field}
                name="code"
                placeholder="OTP"
                type="text"
                variant="bordered"
                radius="sm"
                size='md'
                isInvalid={errors.code?.message ? true : false}
                errorMessage={errors.code?.message}
                classNames={{
                  inputWrapper: ["bg-white"]
                }}
              />
            }
          />
        )} 
        {!showVerificationModel && !showPasswordModel && !showSuccessModel && (
          <Controller
            control={control}
            name="number"
            render={({ field }) =>
              <Input
                {...field}
                name="number"
                placeholder="Phone Number"
                type="text"
                variant="bordered"
                radius="sm"
                size='md'
                isInvalid={errors.number?.message ? true : false}
                errorMessage={errors.number?.message}
                classNames={{
                  inputWrapper: ["bg-white"]
                }}
              />
            }
          />
        )}

        {showSuccessModel === true ? (
          <Button
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
          >
            <Link href={"/sign-in"}>
              Continue to Login
            </Link>
          </Button>
        ) : (
          <Button
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
            type="submit"
            isLoading={isPending}
          >
            {!showVerificationModel && !showPasswordModel ? "Send OTP" : "Confirm"}
          </Button>
        )}

      </form>
    </div>
  )
}

export default ForgetPasswordComponent;