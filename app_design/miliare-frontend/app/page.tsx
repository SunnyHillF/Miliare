"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FeaturePanel = dynamic(() => import("@/components/FeaturePanel"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit() {
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col lg:flex-row w-full overflow-hidden">
      {/* Left: Login Form */}
      <div className="flex flex-col justify-center w-full max-w-md px-6 py-8 md:px-12 bg-white shadow-lg z-10 mx-auto lg:max-w-[480px] lg:mx-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-left">Welcome to Miliare</h1>
          <p className="text-gray-600 text-left">Sign in to your referral network account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        id="remember"
                        className="h-4 w-4 border-gray-300 text-[#1566C0] focus:ring-2 focus:ring-[#1566C0]"
                      />
                    </FormControl>
                    <FormLabel htmlFor="remember" className="mb-0 font-normal">Remember me</FormLabel>
                  </FormItem>
                )}
              />
              <Link href="#" className="text-sm text-primary hover:underline">Forgot your password?</Link>
            </div>
            <Button type="submit" className="w-full bg-[#1566C0] hover:bg-[#1252a3] text-white font-semibold text-base h-11 rounded-md shadow-none border-none">
              Sign in
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-semibold">Register now</Link>
        </div>
      </div>
      {/* Right: Feature Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#1566C0] text-white h-full p-12 min-w-0">
        <div className="flex flex-col items-center max-w-md w-full">
          <div className="bg-white rounded-full p-4 mb-6">
            <Image
              src="/logo.svg"
              alt="Miliare Logo"
              width={48}
              height={48}
              className="size-12 shrink-0"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Miliare Referral Network</h2>
          <FeaturePanel />
        </div>
      </div>
    </div>
  );
}
