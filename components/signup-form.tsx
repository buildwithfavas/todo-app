"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const { error: resError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      if (resError) {
        setError(resError.message || "Failed to create account.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-zinc-200/80 bg-white/90 text-zinc-900 shadow-xl backdrop-blur-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Enter your details to register and get started
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="text"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" variant="gradient" className="w-full h-11" isLoading={isLoading}>
            Sign Up
          </Button>
          <div className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
