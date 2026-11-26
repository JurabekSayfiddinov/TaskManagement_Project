
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SquareCheckBig,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[448px]">

        
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <SquareCheckBig size={20} />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to Task Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Your company workspace for daily tasks & projects
          </p>
        </div>

        
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
           
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Work Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex.morgan@company.com"
                  className="h-[38px] pl-9"
                  required
                />
              </div>
            </div>

         
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="h-[38px] pl-9 pr-10"
                  required
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

          
            <Button
              type="submit"
              className="mt-2 h-9 w-full"
            >
              Sign In
              <ArrowRight size={16} />
            </Button>
          </form>

     
          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              New to the workspace?
            </p>

            <Link
              href="/register"
              className="flex h-[38px] w-full items-center justify-center rounded-md border border-border text-sm font-medium transition-colors hover:bg-muted"
            >
              Create an account
            </Link>
          </div>
        </div>

     
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} />
          <span>
            JWT Bearer Authentication · POST /auth/login
          </span>
        </div>

      </div>
    </main>
  );
}
