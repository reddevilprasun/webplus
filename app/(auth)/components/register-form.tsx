"use client";
import React, { useState, useTransition } from 'react';
import * as z from "zod";
import { RegisterSchema } from '@/schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { register } from '@/actions/register';

const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();

  // for password visibility
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // for form validation
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      number: '',
      password: '',
      firstName: '',
      lastName: '',
      userType: 'user'
    },
  });

  const onSubmitSignup = (value: z.infer<typeof RegisterSchema>) => {

    startTransition(() => {
      register(value)
        .then((data) => {
          if ('success' in data) {
            toast.success(data.success);
          } else if ('error' in data) {
            toast.error(data.error);
          }
        })
        .catch((error) => {
          // Handle any unexpected errors
          console.error('An error occurred:', error);
          toast.error('An error occurred while registering');
        });
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8 rounded-3xl bg-white/70 p-8 shadow-lg dark:bg-gray-800">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Image src={"/icons/logo.png"} width={280} height={280} alt="Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Sign up for a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          &nbsp;Already have an account?
          <Link className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmitSignup)} className="space-y-6" >
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="firstName"
            render={({ field }) =>
              <Input
                {...field}
                name="firstName"
                placeholder="First Name"
                type="text"
                variant="bordered"
                radius="sm"
                size='md'
                isInvalid={errors.firstName?.message ? true : false}
                errorMessage={errors.firstName?.message}
                classNames={{
                  inputWrapper: ["bg-white"]
                }}
              />
            }
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field }) =>
              <Input
                {...field}
                name="last-name"
                placeholder="Last Name"
                type="text"
                variant="bordered"
                radius="sm"
                size='md'
                isInvalid={errors.lastName?.message ? true : false}
                errorMessage={errors.lastName?.message}
                classNames={{
                  inputWrapper: ["bg-white"]
                }}
              />
            }
          />
        </div>

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

        <div>
          <Button
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
            type="submit"
            isLoading={isPending}
          >
            Sign up
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button className="flex items-center border-white justify-center gap-2" variant="bordered">
            <FcGoogle className="h-5 w-5" />
          </Button>
          <Button className="flex items-center border-white justify-center gap-2" variant="bordered">
            <FaGithub className="h-5 w-5" />
          </Button>
          <Button className="flex items-center justify-center border-white gap-2" variant="bordered">
            <FaFacebook className=" fill-blue-500 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
