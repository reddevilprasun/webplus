
"use client";
import * as z from 'zod';
import { LoginSchema } from '@/schema';
import { Button, Checkbox, Input } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useTransition } from 'react'
import { FaFacebook, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '@/actions/login';

const LogInForm = () => {
  const [isPending, startTransition] = useTransition();

  // for password visibility
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // for form validation
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      number: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.success) {
            // Handle success case
            toast.success(data.success);
          } else if (data?.error) {
            // Handle error case
            toast.error(data.error);
          }
        })
        .catch((error) => {
          // Handle any unexpected errors
          console.error('An error occurred:', error);
          toast.error('An error occurred while logging in');
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
          {/* <span className="text-2xl font-bold">WebPlus</span> */}
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <Link
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
            href="/sign-up"
          >
            &nbsp;sign up for a new account
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <Controller
          name="number"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
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

        <Controller
          control={control}
          name="password"
          render={({ field }) =>
            <Input
              {...field}
              name="password"
              placeholder="Password"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
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
              size='md'
              isInvalid={errors.password?.message ? true : false}
              errorMessage={errors.password?.message}
              classNames={{
                inputWrapper: ["bg-white"]
              }}
            />
          }
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox id="remember-me" name="remember-me" />
            <label className="ml-2 block text-sm text-gray-900 dark:text-gray-100" htmlFor="remember-me">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
              href="#"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        <div>
          <Button
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
            type="submit"
            isLoading={isPending}
          >
            Sign in
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button className="flex items-center border-white justify-center gap-2" variant="bordered">
            <FcGoogle className="h-5 w-5" />

          </Button>
          <Button className="flex items-center border-white justify-center gap-2" variant="bordered">
            <FaGithub className="h-5 w-5" />

          </Button>
          <Button className="flex items-center border-white justify-center gap-2" variant="bordered">
            <FaFacebook className="h-5 w-5 fill-blue-500" />

          </Button>
        </div>
      </form>
    </div>
  )
}

export default LogInForm;
