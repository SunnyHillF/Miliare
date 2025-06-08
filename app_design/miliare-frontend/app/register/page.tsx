"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { GalleryVerticalEnd } from "lucide-react"
import { Label } from "@/components/ui/label"
import dynamic from "next/dynamic"

const FeaturePanel = dynamic(() => import("@/components/FeaturePanel"), {
  ssr: false,
})

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    company: "",
    terms: false
  });

  async function onSubmit(values: any) {
    try {
      setIsLoading(true);
      setError("");
      // Dynamically import to reduce initial bundle size
      const { signUp } = await import("aws-amplify/auth");
      const { isSignUpComplete } = await signUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            name: values.name,
            phone_number: values.phone,
            address: values.address,
            'custom:company': values.company,
          },
          autoSignIn: true,
        },
      });
      if (isSignUpComplete) {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left: Logo + Register Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Miliare
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-sm text-muted-foreground">Register to get started</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" {...register("name", { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" {...register("email", { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" {...register("phone", { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Input id="address" placeholder="Enter your address" {...register("address", { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Enter your company name" {...register("company", { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" {...register("password", { required: true })} />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:underline">
                  Sign in here
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Right: Company Info */}
      <div className="relative hidden lg:flex flex-col items-center justify-center gradient-primary text-white">
        <div className="flex flex-col items-center px-10">
          <div className="bg-white/20 rounded-full p-6 mb-6">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.9"/><path d="M7 17v-2a5 5 0 0 1 10 0v2" stroke="#1566C0" strokeWidth="2"/><circle cx="12" cy="10" r="4" stroke="#1566C0" strokeWidth="2"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Miliare Referral Network</h2>
          <FeaturePanel />
        </div>
      </div>
    </div>
  );
}
