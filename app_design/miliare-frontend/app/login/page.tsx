"use client";

import { useForm } from "react-hook-form"
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<LoginForm>();

  async function onSubmit(values: LoginForm) {
    try {
      setIsLoading(true);
      setError("");
      // Add your login logic here (e.g., AWS Amplify signIn)
      // await signIn({ username: values.email, password: values.password });
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left: Logo + Login Form */}
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
                <h1 className="text-2xl font-bold">Welcome to Miliare</h1>
                <p className="text-balance text-sm text-muted-foreground">Sign in to your referral network account</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" {...register("email", { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" {...register("password", { required: true })} />
                </div>
                <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <Checkbox className="h-4 w-4" /> Remember me
          </label>
                  <a href="#" className="text-primary hover:underline">Forgot your password?</a>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-primary hover:underline">
                  Register now
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
          <ul className="space-y-4 mt-4">
            <li className="flex items-start gap-3">
              <span className="bg-white/20 rounded-full p-2"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#fff" fillOpacity="0.9"/><rect x="8" y="11" width="8" height="2" rx="1" fill="#1566C0"/></svg></span>
              <div>
                <div className="font-semibold">Strategic Partnerships</div>
                <div className="text-white/80 text-sm">Connect with industry-leading financial service providers</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 rounded-full p-2"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.9"/><path d="M8 12h8M12 8v8" stroke="#1566C0" strokeWidth="2"/></svg></span>
              <div>
                <div className="font-semibold">Secure Tracking</div>
                <div className="text-white/80 text-sm">Monitor your referrals and commissions in one place</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 rounded-full p-2"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 0v10l6 3" stroke="#1566C0" strokeWidth="2"/></svg></span>
              <div>
                <div className="font-semibold">Rewarding Incentives</div>
                <div className="text-white/80 text-sm">Earn competitive commissions for successful referrals</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 