
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SquareCheckBig,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Ticket,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[448px]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <SquareCheckBig size={20} />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Join your company workspace
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="display_name"
                className="text-sm font-medium"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="display_name"
                  name="display_name"
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  className="h-[38px] pl-9"
                  minLength={1}
                  maxLength={100}
                  required
                />
              </div>

              <p className="text-xs text-muted-foreground">
                1–100 characters
              </p>
            </div>

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
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  className="h-[38px] pl-9 pr-10"
                  minLength={8}
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

              <p className="text-xs text-muted-foreground">
                Minimum 8 characters
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="invite_token"
                className="text-sm font-medium"
              >
                Invitation Token
                <span className="ml-1 text-muted-foreground">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="invite_token"
                  name="invite_token"
                  placeholder="Paste workspace invite token"
                  className="h-[38px] pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 h-9 w-full"
            >
              Create Account
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} />
          <span>Secure workspace registration</span>
        </div>
      </div>
    </main>
  );
}
