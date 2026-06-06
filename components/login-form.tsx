"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const { error: resError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (resError) {
        setError(resError.message || "Invalid credentials.");
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
          Welcome Back
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Enter your email and password to sign in to your dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" variant="gradient" className="w-full h-11" isLoading={isLoading}>
            Sign In
          </Button>
          <div className="text-center text-sm text-zinc-500">
            {"Don't have an account?"}{" "}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
